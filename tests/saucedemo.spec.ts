import { test, expect } from '../fixtures';

test('Add items to cart', async ({ pom }) => {
  
  const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  
  await pom.addItemsToCart.addItemsToCart(items);
  await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(String(items.length));

  await pom.page.locator('[data-test="shopping-cart-link"]').click()
  await pom.page.getByRole('button', { name: 'Checkout' }).click()
  await expect(pom.page.locator('.title')).toHaveText('Checkout: Your Information')

  await pom.checkOutFlow.checkoutFlow('Jason', 'Billones', '1123')

  await pom.page.getByRole('button', { name: 'Back Home' }).click()
})

test('Sorting Alphabetically', async ({ pom }) => {
  
  const expectedNames = await pom.sortOption.getExpectedNames('asc')
  await pom.sortOption.sortBy('az')

  await expect(pom.sortOption.itemNames).toHaveText(expectedNames);
})