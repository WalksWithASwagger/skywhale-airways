export class FilmPlayer {
  constructor(iframe, { onPlaying, onReady, onUnavailable }) {
    this.iframe = iframe;
    this.onPlaying = onPlaying;
    this.onReady = onReady;
    this.onUnavailable = onUnavailable;
    this.entered = false;
    this.ready = false;
  }

  enter() {
    if (this.entered) return;
    this.entered = true;
    const url = new URL(this.iframe.src);
    url.searchParams.set("enablejsapi", "1");
    url.searchParams.set("origin", location.origin);
    this.iframe.src = url.href;
    const timeout = setTimeout(() => this.onUnavailable(), 10000);
    const connect = () => {
      this.player = new window.YT.Player(this.iframe, {
        events: {
          onReady: () => {
            clearTimeout(timeout);
            this.ready = true;
            this.onReady();
          },
          onStateChange: ({ data }) => {
            if (data === 1 || data === 3) this.onPlaying();
          },
          onError: () => {
            clearTimeout(timeout);
            this.ready = false;
            this.onPlaying();
            this.onUnavailable();
          },
        },
      });
    };
    if (window.YT?.Player) connect();
    else {
      window.onYouTubeIframeAPIReady = connect;
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        clearTimeout(timeout);
        this.onUnavailable();
      };
      document.head.append(script);
    }
  }

  async pause() {
    if (!this.entered) return true;
    if (!this.ready) {
      this.onUnavailable();
      return false;
    }
    this.player.pauseVideo();
    // A pause command crosses an iframe boundary. Wait for acknowledgement
    // before allowing another soundtrack, including while the film buffers.
    for (let attempt = 0; attempt < 20; attempt++) {
      if ([-1, 0, 2, 5].includes(this.player.getPlayerState())) {
        this.onReady();
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    this.onUnavailable();
    return false;
  }
}
