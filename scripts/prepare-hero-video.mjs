import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';

// Explicit local preparation only. CI uses the checked-in browser-ready outputs.
// The input upload is never modified, and its full video duration is retained.
// --landscape accepts the approved edit without rotating it a second time.
// Existing fingerprinted delivery files are intentionally never deleted.
const landscape = process.argv.includes('--landscape');
const source = resolve(process.argv.slice(2).find(argument => !argument.startsWith('--')) ?? `${process.env.HOME}/Downloads/herovideo.mp4`);
const temporary = resolve(landscape ? 'tmp/hero-video-edited' : 'tmp/hero-video');
const destination = 'public/media/hero';
await mkdir(temporary, { recursive: true });
await mkdir(destination, { recursive: true });
const probe = path => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]));
const original = probe(source);
const video = original.streams.find(stream => stream.codec_type === 'video');
if (!video || video.width !== (landscape ? 1280 : 720) || video.height !== (landscape ? 720 : 1280)) throw new Error('Review the input orientation/resolution before preparing a different hero source.');
if (landscape) {
  const backup = JSON.parse(await readFile('scripts/hero-video-backup.json', 'utf8'));
  for (const path of [backup.desktop.mp4, backup.desktop.webm, backup.mobile.mp4, backup.mobile.webm, backup.poster, backup.socialPoster]) {
    await stat(`public/${path}`);
  }
}
const run = args => new Promise((resolve, reject) => {
  const process = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
  let errors = '';
  process.stderr.on('data', chunk => { errors += chunk; });
  process.once('error', reject);
  process.once('close', code => code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exited with ${code}`)));
});
async function publish(file, stem, extension) {
  const data = await readFile(file);
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
  const name = `${stem}-${hash}.${extension}`;
  await rename(file, join(destination, name));
  return `media/hero/${name}`;
}

const variants = await Promise.all([
  { id: 'desktop', width: 1280, height: 720, filter: `${landscape ? '' : 'transpose=cclock,'}setsar=1`, bitrate: landscape ? '2100k' : '1900k', webmBitrate: landscape ? '1500k' : '1300k' },
  // Phones already show only the centre of the landscape frame. Encode that
  // visible area at native height, saving bytes without downscaling its detail.
  { id: 'mobile', width: 720, height: 720, filter: `${landscape ? '' : 'transpose=cclock,'}crop=720:720:(iw-720)/2:0,setsar=1`, bitrate: landscape ? '1100k' : '1050k', webmBitrate: landscape ? '800k' : '750k' }
].map(async variant => {
  const results = await Promise.all(['mp4', 'webm'].map(async extension => {
    const path = join(temporary, `${variant.id}.${extension}`);
    const codec = extension === 'mp4'
      ? ['-c:v', 'libx264', '-preset', 'slow', '-b:v', variant.bitrate, '-profile:v', 'high', '-level:v', '3.1']
      : ['-c:v', 'libvpx-vp9', '-b:v', variant.webmBitrate, '-deadline', 'good', '-cpu-used', '3', '-row-mt', '1', '-tile-columns', '1', '-frame-parallel', '1'];
    const common = ['-noautorotate', '-i', source, '-map', '0:v:0', '-an', '-sn', '-dn', '-vf', variant.filter,
      '-pix_fmt', 'yuv420p', '-g', '60', '-threads', '4', ...codec,
      '-map_metadata', '-1', '-metadata:s:v:0', 'rotate=0', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709'];
    const passlog = join(temporary, `${variant.id}-${extension}-pass`);
    // Two-pass allocation keeps detailed water/palms sharp within the delivery budget.
    await run([...common, '-pass', '1', '-passlogfile', passlog, '-f', 'null', '/dev/null']);
    await run([...common, '-pass', '2', '-passlogfile', passlog, ...(extension === 'mp4' ? ['-movflags', '+faststart'] : []), path]);
    const url = await publish(path, `kadmat-${variant.id}`, extension);
    const bytes = (await stat(`public/${url}`)).size;
    console.log(`${variant.id} ${extension}: ${(bytes / 1048576).toFixed(2)} MB (${variant.width}×${variant.height}, no audio)`);
    return [extension, url];
  }));
  return [variant.id, { ...Object.fromEntries(results), width: variant.width, height: variant.height }];
}));

const posterPng = join(temporary, 'poster.png');
await run(['-noautorotate', '-ss', '1', '-i', source, '-vf', `${landscape ? '' : 'transpose=cclock,'}setsar=1`, '-frames:v', '1', '-an', '-map_metadata', '-1', posterPng]);
const posterWebp = join(temporary, 'poster.webp');
execFileSync('cwebp', ['-quiet', '-q', '90', '-m', '6', '-sharp_yuv', '-metadata', 'none', posterPng, '-o', posterWebp]);
const posterJpeg = join(temporary, 'poster.jpg');
await run(['-i', posterPng, '-frames:v', '1', '-q:v', '2', '-map_metadata', '-1', posterJpeg]);
const metadata = {
  rotation: landscape ? 'already landscape; no additional rotation' : '90 degrees anticlockwise',
  sourceName: basename(source),
  sourceSha256: createHash('sha256').update(await readFile(source)).digest('hex'),
  duration: Number(video.duration ?? original.format.duration),
  frameRate: video.avg_frame_rate,
  ...Object.fromEntries(variants),
  poster: await publish(posterWebp, 'kadmat-poster', 'webp'),
  socialPoster: await publish(posterJpeg, 'kadmat-poster', 'jpg'),
  posterAlt: landscape ? 'A dive boat crossing the turquoise lagoon in Kadmat, Lakshadweep' : 'Aerial view of Kadmat lagoon and its island shoreline',
  sourceBytes: Number(original.format.size)
};
await writeFile('src/app/data/hero-media.generated.ts', `// Generated by scripts/prepare-hero-video.mjs from ${basename(source)}.\n// Original delivery assets are retained in scripts/hero-video-backup.json.\nexport const HERO_MEDIA = ${JSON.stringify(metadata, null, 2)} as const;\n`);
console.log(JSON.stringify(metadata, null, 2));
