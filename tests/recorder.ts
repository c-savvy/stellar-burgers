import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:4000');

  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'mockRefreshToken');
  });
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'mockAccessToken',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.routeFromHAR('./tests/hars/api.har', {
    url: '**/api/**',
    update: true,
    updateMode: 'full',
    updateContent: 'embed'
  });

  await page.reload();
  await page.waitForTimeout(3000);

  const addButtons = page.locator('button', { hasText: 'Добавить' });
  if (await addButtons.first().isVisible()) {
    await addButtons.first().click();
    await addButtons.nth(2).click();

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    if (await orderButton.isVisible()) {
      await orderButton.click();
      await page.waitForTimeout(3000);
    }
  }

  await context.close();
  await browser.close();

})();