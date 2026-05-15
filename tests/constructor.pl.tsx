import { test, expect } from '@playwright/test';

test.describe('constructor', () => {
  test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'mockAccessToken',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.route('**/api/auth/user', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@test.com', name: 'TestUser' }
      })
    });
  });

  await page.route('**/api/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        user: { email: 'test@test.com', name: 'TestUser' }
      })
    });
  });

  await page.route('**/api/orders', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Test Order',
          order: { number: 67890 }
        })
      });
    } else {
      route.continue();
    }
  });

  await page.routeFromHAR('./tests/hars/api.har', {
    url: '**/api/**',
    notFound: 'fallback',
    update: false
  });

  await page.goto('/');

  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'mockRefreshToken');
  });

  await expect(page.locator('button', { hasText: 'Добавить' }).first()).toBeVisible({ timeout: 10000 });
});
    test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
    await page.context().clearCookies();
  });



  test('добавляет булки и начинку в конструктор', async ({ page }) => {
    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(2).click();

    await expect(page.getByText('Выберите булки')).toBeHidden();
    await expect(page.getByText('Выберите начинку')).toBeHidden();
  });

  test('открывает и закрывает модалку ингредиента', async ({ page }) => {
    await page.locator('a[href^="/ingredients/"]').first().click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.locator('#modals button').first().click();
    await expect(page.getByText('Детали ингредиента')).toBeHidden();
  });

  test('показывает в модалке корректный ингредиент', async ({ page }) => {
    await page.locator('a[href="/ingredients/643d69a5c3f7b9001cfa093c"]').click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Краторная булка N-200i' })).toBeVisible();
    await expect(page.getByText('420')).toBeVisible();

    await page.locator('#modals button').first().click();
  });

  test('закрывает модалку ингредиента по клику на оверлей', async ({ page }) => {
    await page.locator('a[href^="/ingredients/"]').first().click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    // кликаем гдето вне модалки
    await page.mouse.click(10, 10);
    
    await expect(page.getByText('Детали ингредиента')).toBeHidden();
  });

    test('выполняет оформление заказа', async ({ page }) => {

    await page.goto('/login');
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button', { hasText: 'Войти' }).click();

    await expect(page.locator('button', { hasText: 'Добавить' }).first()).toBeVisible({ timeout: 10000 });

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(2).click();

    await page.locator('button', { hasText: 'Оформить заказ' }).click();
    await expect(page.getByText('67890')).toBeVisible({ timeout: 10000 });

    await page.locator('#modals button').first().click();
    await expect(page.getByText('67890')).toBeHidden();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});