export interface BackgroundPlaybackState {
  playing(): void;
  blocked(): void;
}

export function connectBackgroundPlayback(video: HTMLVideoElement, document: Document, state: BackgroundPlaybackState): { play(): void; destroy(): void } {
  let destroyed = false;
  let pending = false;
  let covered = !!document.querySelector('.page-transition--initial')
    && !document.documentElement.classList.contains('initial-loader-failed');
  const view = document.defaultView;
  video.muted = true;
  video.playsInline = true;

  const failed = (error: unknown): void => {
    if (destroyed || document.visibilityState === 'hidden') return;
    if (!(error instanceof Error) || error.name !== 'AbortError') state.blocked();
  };
  const play = (): void => {
    if (destroyed || covered || pending || document.visibilityState === 'hidden' || !video.paused) return;
    video.muted = true;
    pending = true;
    try {
      void video.play().catch(failed).finally(() => { pending = false; });
    } catch (error) { pending = false; failed(error); }
  };
  const playing = (): void => { if (!destroyed) state.playing(); };
  const paused = (): void => {
    if (!destroyed && !covered && document.visibilityState !== 'hidden' && !video.ended) state.blocked();
  };
  const uncover = (): void => { covered = false; play(); };
  const reselectSource = (): void => { video.load(); play(); };
  const breakpoint = view?.matchMedia('(max-width: 767px)');

  video.addEventListener('playing', playing);
  video.addEventListener('pause', paused);
  video.addEventListener('canplay', play);
  video.addEventListener('error', paused);
  document.addEventListener('scuba-lak:initial-ready', uncover, { once: true });
  document.addEventListener('visibilitychange', play);
  document.addEventListener('click', play, { passive: true });
  document.addEventListener('touchend', play, { passive: true });
  document.addEventListener('keydown', play);
  view?.addEventListener('pageshow', play);
  breakpoint?.addEventListener('change', reselectSource);
  play();

  return {
    play,
    destroy(): void {
      destroyed = true;
      video.removeEventListener('playing', playing);
      video.removeEventListener('pause', paused);
      video.removeEventListener('canplay', play);
      video.removeEventListener('error', paused);
      document.removeEventListener('scuba-lak:initial-ready', uncover);
      document.removeEventListener('visibilitychange', play);
      document.removeEventListener('click', play);
      document.removeEventListener('touchend', play);
      document.removeEventListener('keydown', play);
      view?.removeEventListener('pageshow', play);
      breakpoint?.removeEventListener('change', reselectSource);
      video.pause();
    }
  };
}
