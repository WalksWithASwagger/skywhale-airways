import test from "node:test";
import { setImmediate } from "node:timers";
import assert from "node:assert/strict";
import { AudioBed } from "../src/audio.js";

function fixture({
  beforePlay = () => true,
  delayedPlay = false,
  delayedResume = false,
} = {}) {
  let finishPlay;
  let finishResume;
  const attributes = {};
  const media = {
    paused: true,
    calls: 0,
    pause() {
      this.paused = true;
    },
    play() {
      this.calls++;
      if (!delayedPlay) {
        this.paused = false;
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        finishPlay = () => {
          this.paused = false;
          resolve();
        };
      });
    },
  };
  globalThis.Audio = class {
    constructor() {
      return media;
    }
  };
  globalThis.window = {
    AudioContext: class {
      state = delayedResume ? "suspended" : "running";
      resume() {
        return new Promise((resolve) => {
          finishResume = resolve;
        });
      }
      createMediaElementSource() {
        return { connect() {} };
      }
      createAnalyser() {
        return { connect() {}, frequencyBinCount: 0 };
      }
    },
  };
  const toggle = {
    addEventListener() {},
    setAttribute(k, v) {
      attributes[k] = v;
    },
    classList: { toggle() {} },
  };
  const audio = new AudioBed(toggle, { src: "/audio-test.mp3", beforePlay });
  return {
    audio,
    media,
    attributes,
    finishPlay: () => finishPlay(),
    finishResume: () => finishResume(),
  };
}

test("film entry cancels an ambient start waiting for audio-context resume", async () => {
  const f = fixture({ delayedResume: true });
  const pending = f.audio.start();
  f.audio.pause();
  f.finishResume();
  await pending;
  assert.equal(f.media.calls, 0);
  assert.equal(f.attributes["aria-pressed"], "false");
});

test("a late media play completion cannot restart ambience after film entry", async () => {
  const f = fixture({ delayedPlay: true });
  const pending = f.audio.start();
  await new Promise((resolve) => setImmediate(resolve));
  f.audio.pause();
  f.finishPlay();
  await pending;
  assert.equal(f.media.paused, true);
  assert.equal(f.attributes["aria-pressed"], "false");
});

test("ambient playback waits for film pause acknowledgement", async () => {
  let acknowledge;
  const f = fixture({
    beforePlay: () =>
      new Promise((resolve) => {
        acknowledge = resolve;
      }),
  });
  const pending = f.audio.start();
  assert.equal(f.media.calls, 0);
  acknowledge(true);
  await pending;
  assert.equal(f.media.paused, false);
  assert.equal(f.attributes["aria-pressed"], "true");
});

test("unavailable film coordination keeps ambience muted", async () => {
  const f = fixture({ beforePlay: () => false });
  await f.audio.start();
  assert.equal(f.media.calls, 0);
  assert.equal(f.media.paused, true);
  assert.equal(f.attributes["aria-pressed"], "false");
});

test("a late old play cannot bypass a newer film-pause request", async () => {
  let acknowledge;
  let attempts = 0;
  const f = fixture({
    delayedPlay: true,
    beforePlay: () =>
      ++attempts === 1
        ? true
        : new Promise((resolve) => {
            acknowledge = resolve;
          }),
  });
  const oldPlay = f.audio.start();
  await new Promise((resolve) => setImmediate(resolve));
  f.audio.pause();
  const retry = f.audio.start();
  f.finishPlay();
  await oldPlay;
  assert.equal(
    f.media.paused,
    true,
    "pending permission is not permission to play"
  );
  acknowledge(false);
  await retry;
});
