import { test, expect } from '@playwright/test';
import ingredientsMock from './mocks/ingredients.json';
import userMock from './mocks/user.json';
import orderMock from './mocks/order.json';
import loginMock from './mocks/login.json';

test.describe('Constructor', () => {

  test.beforeEach(async ({ page }) => {

    await page.route('**/api/ingredients', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredientsMock)
      });
    });

    await page.route('**/api/auth/user', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(userMock)
      });
    });

    await page.route('**/api/auth/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(loginMock)
      });
    });

    await page.route('**/api/orders', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(orderMock)
        });
      } else {
        route.continue();
      }
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mockAccessToken',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.goto('/');
  });

  test('добавляет булки и начинку в конструктор', async ({ page }) => {
    await page.waitForResponse('**/api/ingredients');

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();

    await addButtons.nth(2).click();

    await expect(page.getByText('Выберите булки')).toBeHidden();
    await expect(page.getByText('Выберите начинку')).toBeHidden();
  });

  test('открывает и закрывает модалку ингредиента', async ({ page }) => {
  await page.waitForResponse('**/api/ingredients');

  await page.locator('a[href^="/ingredients/"]').first().click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  await page.locator('#modals button').first().click();

  await expect(page.getByText('Детали ингредиента')).toBeHidden();
});

test('закрывает модалку ингредиента по клику на оверлей ', async ({ page }) => {
  await page.waitForResponse('**/api/ingredients');

  await page.locator('a[href^="/ingredients/"]').first().click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  // клилк где-то вне модалки
  await page.mouse.click(10, 10);

  await expect(page.getByText('Детали ингредиента')).toBeHidden();
});

  test('выполняет оформление заказа', async ({ page }) => {
    await page.waitForResponse('**/api/ingredients');

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();

    await addButtons.nth(2).click();

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    await orderButton.click();

    await expect(page.getByText('67890')).toBeVisible();

    await page.locator('#modals button').first().click();
    await expect(page.getByText('67890')).toBeHidden(); 

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});