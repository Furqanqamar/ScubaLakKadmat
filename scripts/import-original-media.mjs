import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Run explicitly; never needed by CI. Source files are read without modification.
// Requires macOS Swift/ImageIO, cwebp and FFmpeg with zscale and libx264.
const sourceRoot = resolve(process.argv[2] ?? `${process.env.HOME}/Downloads`);
const ffmpeg = process.env.MEDIA_FFMPEG ?? (existsSync('/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg') ? '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg' : 'ffmpeg');
const manifest = JSON.parse(readFileSync(new URL('./original-media.json', import.meta.url), 'utf8'));
const outputRoot = 'public/media/originals';
const temporaryRoot = resolve('tmp/original-media');
mkdirSync(outputRoot, { recursive: true });
mkdirSync(temporaryRoot, { recursive: true });
const run = (command, args) => execFileSync(command, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024 });
const ffprobe = ffmpeg.includes('/') ? ffmpeg.replace(/ffmpeg$/, 'ffprobe') : 'ffprobe';
const probe = path => JSON.parse(run(ffprobe, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', path]));
function hashedFile(temporary, stem, extension) {
  const hash = createHash('sha256').update(readFileSync(temporary)).digest('hex').slice(0, 12);
  const filename = `${stem}-${hash}.${extension}`;
  renameSync(temporary, join(outputRoot, filename));
  return `media/originals/${filename}`;
}
run('swift', ['scripts/convert-original-photos.swift', sourceRoot, temporaryRoot]);
const assets = {};
const imageInfo = {};
let originalBytes = 0;
let deliveryBytes = 0;
for (const entry of manifest) {
  const source = join(sourceRoot, entry.file);
  originalBytes += statSync(source).size;
  let imageSource = join(temporaryRoot, `${entry.id}.png`);
  let videoUrl;
  let videoUrlMobile;
  if (entry.kind === 'video') {
    for (const [width, suffix, crf, maxrate] of [[1080, '', '21', '6000k'], [720, '-mobile', '23', '2800k']]) {
      const temporary = join(temporaryRoot, `${entry.id}${suffix}.mp4`);
      // Auto-rotation respects the phone's display matrix. Tone-map HLG into SDR
      // before H.264 encoding so turquoise water and skin do not look washed out.
      const filter = `fps=30,scale=${width}:-2:flags=lanczos,zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,setsar=1`;
      run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(entry.start), '-i', source, '-t', String(entry.length), '-map', '0:v:0', '-map', '0:a:0?', '-vf', filter, '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-maxrate', maxrate, '-bufsize', String(Number.parseInt(maxrate) * 2) + 'k', '-threads', '4', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-map_metadata', '-1', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', temporary]);
      const url = hashedFile(temporary, `${entry.id}${suffix}`, 'mp4');
      if (suffix) videoUrlMobile = url; else videoUrl = url;
      deliveryBytes += statSync(`public/${url}`).size;
    }
    run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '2', '-i', `public/${videoUrl}`, '-frames:v', '1', imageSource]);
  }
  const info = probe(imageSource).streams[0];
  const variants = [];
  for (const width of [480, 800, info.width]) {
    if (variants.some(variant => variant.width === width)) continue;
    const temporary = join(temporaryRoot, `${entry.id}-${width}.webp`);
    run('cwebp', ['-quiet', '-q', '90', '-m', '6', '-sharp_yuv', '-resize', String(width), '0', imageSource, '-o', temporary]);
    const url = hashedFile(temporary, `${entry.id}-${width}`, 'webp');
    variants.push({ width, url });
    deliveryBytes += statSync(`public/${url}`).size;
  }
  const imageUrl = variants.at(-1).url;
  const placeholderPath = join(temporaryRoot, `${entry.id}-placeholder.webp`);
  run('cwebp', ['-quiet', '-q', '40', '-resize', '24', '0', imageSource, '-o', placeholderPath]);
  const placeholder = `data:image/webp;base64,${readFileSync(placeholderPath).toString('base64')}`;
  assets[entry.id] = { id: entry.id, kind: entry.kind, title: entry.title, description: entry.description, location: entry.location, category: entry.category, imageUrl, width: info.width, height: info.height, size: info.height > info.width ? 'tall' : 'wide', ...(videoUrl ? { videoUrl, videoUrlMobile, durationLabel: `0:${String(entry.length).padStart(2, '0')}` } : {}) };
  imageInfo[imageUrl] = { srcset: variants.map(variant => `${variant.url} ${variant.width}w`).join(', '), width: info.width, height: info.height, placeholder };
  console.log(`Prepared ${entry.id}`);
}
// These generated source files are intentionally checked in; CI doesn't need originals.
writeFileSync('src/app/data/original-media.generated.ts', `// Generated by scripts/import-original-media.mjs. Edit captions in scripts/original-media.json.\nimport { GalleryItem } from '../models/site-data.model';\n\nexport const ORIGINAL_MEDIA = ${JSON.stringify(assets, null, 2)} as const satisfies Readonly<Record<string, GalleryItem>>;\n`);
writeFileSync('src/app/data/original-image-info.generated.ts', `// Generated browser image metadata; no source photographs are embedded.\nexport interface OriginalImageInfo { readonly srcset: string; readonly width: number; readonly height: number; readonly placeholder: string; }\nexport const ORIGINAL_IMAGE_INFO: Readonly<Record<string, OriginalImageInfo>> = ${JSON.stringify(imageInfo, null, 2)};\n`);
console.log(`Original sources: ${(originalBytes / 1048576).toFixed(1)} MB; all delivery sizes including mobile variants: ${(deliveryBytes / 1048576).toFixed(1)} MB.`);
