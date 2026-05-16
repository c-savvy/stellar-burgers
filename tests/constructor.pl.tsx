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

    await page.routeFromHAR('./tests/hars/api.har', {
      url: '**/api/**',
      notFound: 'abort',
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

      await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

      await addButtons.nth(2).click();

      await expect(
        page.locator('.constructor-element__text', { hasText: 'Биокотлета из марсианской Магнолии' })
      ).toBeVisible();

      await expect(page.getByText('Выберите булки')).toBeHidden();
      await expect(page.getByText('Выберите начинку')).toBeHidden();
    });

    test('открывает и закрывает модалку ингредиента', async ({ page }) => {
      await page.locator('a[href^="/ingredients/"]').first().click();

      const modal = page.locator('#modals');
      await expect(modal.getByText('Детали ингредиента')).toBeVisible();

      await modal.locator('button').first().click();
      await expect(modal.getByText('Детали ингредиента')).toBeHidden();
    });

    test('показывает в модалке корректный ингредиент', async ({ page }) => {
      await page.locator('a[href="/ingredients/643d69a5c3f7b9001cfa093c"]').click();

      const modal = page.locator('#modals');

      await expect(modal.getByText('Детали ингредиента')).toBeVisible();
      await expect(modal.getByRole('heading', { name: 'Краторная булка N-200i' })).toBeVisible();
      await expect(modal.getByText('420')).toBeVisible();

      await modal.locator('button').first().click();
    });

    test('закрывает модалку ингредиента по клику на оверлей', async ({ page }) => {
      await page.locator('a[href^="/ingredients/"]').first().click();

      const modal = page.locator('#modals');
      await expect(modal.getByText('Детали ингредиента')).toBeVisible();

      // кликаем гдето вне модалки
      await page.mouse.click(10, 10);
      
      await expect(modal.getByText('Детали ингредиента')).toBeHidden();
    });

    test('выполняет оформление заказа', async ({ page }) => {
    
      const addButtons = page.locator('button', { hasText: 'Добавить' });
      await addButtons.first().click();
      await addButtons.nth(2).click();

      await page.locator('button', { hasText: 'Оформить заказ' }).click();

      const modal = page.locator('#modals');
      await expect(modal.getByText('67890')).toBeVisible({ timeout: 10000 });

      await modal.locator('button').first().click();
      await expect(modal.getByText('67890')).toBeHidden();

      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку').first()).toBeVisible();
    });

});