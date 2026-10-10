import { test as base, createBdd } from 'playwright-bdd';

type Fixtures = {
  maximizeWindow: void;
};

export const test = base.extend<Fixtures>({
  maximizeWindow: [async ({ page }, use) => {
    try {
      const session = await page.context().newCDPSession(page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'maximized' },
      });
    } catch {
      // 无头模式没有可调整的窗口。
    }
    await use();
  }, { auto: true }],
});

export const { Step: aistep } = createBdd(test);
