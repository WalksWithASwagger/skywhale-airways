import assert from "node:assert/strict";
import { join } from "node:path";

// Deterministic provider boundary. Real native YouTube playback is a separate
// manual check; a network/video-account failure must not masquerade as a UI pass.
async function stubPlayer(page) {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<button aria-label="Play video">Play</button>',
    })
  );
  await page.route("https://www.youtube.com/iframe_api", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.YT = { Player: class {
      constructor(frame, {events}) {
        this.state = 5;
        this.events = events;
        window.testPlayer = this;
        setTimeout(() => events.onReady({target:this}), 0);
      }
      pauseVideo() {
        this.pauseRequested = true;
        if (!this.holdPause) this.state = 2;
      }
      getPlayerState() { return this.state; }
      play() { this.state = 1; this.events.onStateChange({data:1}); }
    }}; window.onYouTubeIframeAPIReady();`,
    })
  );
}

export async function checkFilmEntry(browser, url, shotDir) {
  const cases = [];
  async function scenario(name, options, check, expectedErrors = []) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    try {
      await stubPlayer(page);
      await check(page, context);
      assert.deepEqual(
        errors,
        expectedErrors,
        `${name}: unexpected console/page errors`
      );
      cases.push(name);
      console.log(`✓ ${name}`);
    } finally {
      await context.close();
    }
  }

  for (const width of [1280, 390, 375]) {
    await scenario(
      `watch-first, keyboard, history, souvenir (${width}px)`,
      {
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      },
      async (page) => {
        const portalRequests = [];
        page.on("request", (r) => {
          if (/\/portal[-.]/.test(r.url())) portalRequests.push(r.url());
        });
        await page.goto(url);
        await page.locator('#gate[role="dialog"]').waitFor();
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          "gate-watch"
        );
        await page.keyboard.press("Shift+Tab");
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          "gate-muted"
        );
        await page.keyboard.press("Tab");
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          "gate-watch"
        );
        await page.screenshot({
          path: join(shotDir, `film-entry-${width}.png`),
        });
        await page.keyboard.press("Enter");
        await page.waitForFunction(
          () => document.activeElement.id === "film-title"
        );
        assert.equal(new URL(page.url()).hash, "#film-slot");
        assert.equal(await page.locator("#gate").isVisible(), false);
        assert.equal(await page.locator(".scene-panel").count(), 0);
        assert.equal(
          portalRequests.length,
          0,
          "Watch must not request the portal"
        );
        assert.equal(
          await page.evaluate(
            () =>
              document.querySelector("#film-slot").getBoundingClientRect()
                .top >= 0
          ),
          true
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
          ),
          true
        );
        assert.equal(
          await page
            .locator("#film-frame iframe")
            .evaluate((el) => el.getBoundingClientRect().height >= 200),
          true,
          "YouTube requires a 200px minimum player viewport"
        );
        const iframeUrl = new URL(
          await page.locator("#film-frame iframe").getAttribute("src")
        );
        assert.equal(iframeUrl.host, "www.youtube-nocookie.com");
        assert.equal(iframeUrl.pathname, "/embed/3xmfwiwdhm8");
        assert.equal(iframeUrl.searchParams.get("origin"), new URL(url).origin);
        assert.equal(iframeUrl.searchParams.has("autoplay"), false);
        await page.waitForFunction(() => window.testPlayer);
        await page.screenshot({
          path: join(shotDir, `film-screening-${width}.png`),
        });
        await page.getByRole("link", { name: "Make a souvenir ↓" }).click();
        await page.waitForFunction(
          () => document.activeElement.id === "artifacts-title"
        );
        await page.locator('[data-value="route"]').first().waitFor();
        await page.locator("#artifact-name").fill("Proof Traveller");
        await page.locator('.artifact-type-option[data-value="route"]').click();
        await page.goBack();
        await page.waitForFunction(() => location.hash === "#film-slot");
        await page.goForward();
        await page.waitForFunction(() => location.hash === "#artifact-lab");
        assert.equal(
          await page.locator("#artifact-name").inputValue(),
          "Proof Traveller"
        );
        assert.equal(
          await page
            .locator('.artifact-type-option[data-value="route"]')
            .getAttribute("aria-pressed"),
          "true"
        );
        assert.equal(await page.locator("#gate").isVisible(), false);
        await page.screenshot({
          path: join(shotDir, `film-souvenir-${width}.png`),
        });
      }
    );
  }

  await scenario(
    "permalink works without WebGL",
    {},
    async (page) => {
      await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          if (type.startsWith("webgl")) throw new Error("WebGL unavailable");
          return getContext.call(this, type, ...args);
        };
      });
      await page.goto(`${url}#film-slot`);
      await page.locator("#film-frame iframe").waitFor();
      assert.equal(await page.locator("#gate").isVisible(), false);
      assert.equal(await page.locator(".scene-panel").count(), 0);
      await page.getByRole("button", { name: "Wander the airport" }).click();
      await page
        .getByText("The airport couldn’t open. The film is ready to watch.", {
          exact: true,
        })
        .last()
        .waitFor();
      assert.equal(
        await page
          .getByRole("link", { name: "Watch on YouTube", exact: true })
          .isVisible(),
        true
      );
    },
    ["THREE.WebGLRenderer: WebGL unavailable"]
  );

  await scenario(
    "native HTML film navigation without JavaScript",
    { javaScriptEnabled: false },
    async (page) => {
      await page.goto(url);
      await page.locator("#gate-watch").press("Enter");
      assert.equal(new URL(page.url()).hash, "#film-slot");
      assert.equal(await page.locator("#film-frame iframe").isVisible(), true);
      assert.equal(
        await page
          .getByRole("link", { name: "Watch on YouTube", exact: true })
          .isVisible(),
        true
      );
      assert.equal(await page.locator("#gate-board").isVisible(), false);
    }
  );

  await scenario(
    "film access survives application module failure",
    {},
    async (page) => {
      await page.route(/\/main[-.].*\.js/, (route) =>
        route.fulfill({
          contentType: "text/javascript",
          body: 'throw new Error("Injected application failure");',
        })
      );
      await page.goto(url);
      await page.locator("#gate-watch").click();
      assert.equal(new URL(page.url()).hash, "#film-slot");
      assert.equal(await page.locator("#gate-board").isVisible(), false);
      assert.equal(
        await page
          .getByRole("link", { name: "Watch on YouTube", exact: true })
          .isVisible(),
        true
      );
    },
    ["Injected application failure"]
  );

  await scenario(
    "terminal import failure cannot block film",
    {},
    async (page) => {
      await page.route(/\/artifact-lab[-.].*\.js/, (route) =>
        route.fulfill({
          contentType: "text/javascript",
          body: 'throw new Error("Terminal unavailable");',
        })
      );
      await page.goto(`${url}#film-slot`);
      await page.getByText(/The souvenir desk couldn’t open/).waitFor();
      assert.equal(await page.locator("#film-frame iframe").isVisible(), true);
      assert.equal(await page.locator("#gate").isVisible(), false);
      assert.equal(
        await page.locator(".artifact-lab-shell").evaluate((el) => el.inert),
        true
      );
    }
  );

  await scenario(
    "slow portal loading can be escaped into Watch",
    {},
    async (page) => {
      let release;
      await page.route(/\/portal[-.].*\.js/, async (route) => {
        await new Promise((resolve) => {
          release = resolve;
        });
        await route.continue();
      });
      await page.goto(url);
      await page.locator("#gate-muted").click();
      await page
        .getByText(/Opening the airport/)
        .first()
        .waitFor();
      await page.locator("#gate-watch").click();
      await page.waitForFunction(
        () => document.activeElement.id === "film-title"
      );
      assert.equal(await page.locator("#gate").isVisible(), false);
      release();
      await page.waitForLoadState("networkidle");
      assert.equal(await page.locator(".scene-panel").count(), 0);
    }
  );

  await scenario(
    "legacy artifact link bypasses portal and restores reduced-motion destination",
    { reducedMotion: "reduce" },
    async (page) => {
      const portalRequests = [];
      page.on("request", (r) => {
        if (/\/portal[-.]/.test(r.url())) portalRequests.push(r.url());
      });
      await page.goto(`${url}#pass?name=Legacy%20Traveller&destination=1990s`);
      await page.locator("#gate-muted").click();
      await page.waitForFunction(
        () =>
          document.querySelector("#artifact-name").value === "Legacy Traveller"
      );
      assert.equal(
        await page
          .locator('.artifact-decade[data-value="1990s"]')
          .getAttribute("aria-pressed"),
        "true"
      );
      assert.equal(portalRequests.length, 0);
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "artifacts-title"
      );
    }
  );

  for (const apiAvailable of [true, false]) {
    await scenario(
      `sound handoff (API ${apiAvailable ? "ready" : "unavailable"})`,
      {},
      async (page) => {
        await page.addInitScript(() => {
          const nativeAudio = window.Audio;
          window.Audio = class extends nativeAudio {
            constructor(...args) {
              super(...args);
              window.testAmbient = this;
            }
            play() {
              this.testPlaying = true;
              return Promise.resolve();
            }
            pause() {
              this.testPlaying = false;
              super.pause();
            }
          };
        });
        if (!apiAvailable)
          await page.route("https://www.youtube.com/iframe_api", (route) =>
            route.fulfill({
              contentType: "text/javascript",
              body: "/* provider unavailable */",
            })
          );
        await page.goto(url);
        await page.locator("#gate-board").click();
        await page.waitForFunction(() =>
          document.body.classList.contains("portal-ready")
        );
        await page.waitForFunction(
          () => window.testAmbient.testPlaying === true
        );
        await page.locator("#journey-watch").click();
        assert.equal(
          await page.evaluate(() => window.testAmbient.testPlaying),
          false
        );
        await page.locator("#film-wander").click();
        await page.locator("#audio-toggle").waitFor();
        assert.equal(
          await page.evaluate(() => window.testAmbient.testPlaying),
          false,
          "no automatic audio resumption"
        );
        if (apiAvailable) {
          await page.waitForFunction(() => window.testPlayer);
          await page.evaluate(() => {
            window.testPlayer.play();
            window.testPlayer.holdPause = true;
          });
          await page.locator("#audio-toggle").click();
          await page.waitForFunction(() => window.testPlayer.pauseRequested);
          assert.equal(
            await page.evaluate(() => window.testAmbient.testPlaying),
            false
          );
          await page.evaluate(() => {
            window.testPlayer.state = 2;
          });
          await page.waitForFunction(
            () => window.testAmbient.testPlaying === true
          );
          await page.evaluate(() => window.testPlayer.play());
          await page.waitForFunction(
            () => window.testAmbient.testPlaying === false
          );
          await page.locator("#audio-toggle").click();
          await page
            .locator("#audio-status")
            .filter({ hasText: "Airport sound is unavailable for now." })
            .waitFor();
          assert.equal(
            await page.evaluate(() => window.testAmbient.testPlaying),
            false,
            "unacknowledged pause must fail muted"
          );
          await page.evaluate(() => {
            window.testPlayer.holdPause = false;
          });
          await page.locator("#audio-toggle").click();
          await page.waitForFunction(
            () => window.testAmbient.testPlaying === true
          );
          assert.equal(await page.locator("#audio-status").textContent(), "");
        } else {
          await page.locator("#audio-toggle").click();
          await page
            .locator("#audio-status")
            .filter({ hasText: "Airport sound is unavailable for now." })
            .waitFor();
          assert.equal(
            await page.evaluate(() => window.testAmbient.testPlaying),
            false
          );
          assert.equal(
            await page.locator("#audio-toggle").getAttribute("aria-pressed"),
            "false"
          );
        }
      }
    );
  }
  console.log(
    `${cases.length} film-entry scenarios passed (no unexpected console/page errors)`
  );
}
