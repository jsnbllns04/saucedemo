import { test, expect } from '../fixtures';
import { productInformation } from '../test-data';

test.describe('Sorting and adding items to cart', () => {
  test('SAUC-T17 Inventory shows 6 products with name, price, image, button', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/inventory.html`)
    const items = page.locator('[data-test="inventory-item"]')

    await expect(items).toHaveCount(productInformation.length);
    for (const [index, product] of productInformation.entries()) {
      const item = items.nth(index)

      await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(product.name)
      await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(product.description)
      await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(product.price)

      const image = item.locator('img.inventory_item_img')
      await expect(image).toBeVisible()
      await expect(image).toHaveAttribute('alt', product.name)

      const addtoCart = item.getByRole('button', { name: 'Add to cart' })
      await expect(addtoCart).toBeVisible()
      await expect(addtoCart).toBeEnabled()
      await expect(addtoCart).toHaveText('Add to cart')
    }
  })

  test('SAUC-T18 Sort by name (A-Z)', async ({ pom }) => {

    const expectedNames = await pom.sortOption.getExpectedNames('asc')
    await pom.sortOption.sortBy('az')

    await expect(pom.sortOption.itemNames).toHaveText(expectedNames);
  })

  test('SAUC-T19 Sort by price (high-low)', async ({ pom }) => {

    const expectedPrices = await pom.sortOption.getExpectedPrices('desc')
    await pom.sortOption.sortBy('hilo')

    const actualPrices = await pom.sortOption.getItemPricesValues()

    expect(actualPrices).toEqual(expectedPrices);
  })


  test('SAUC-T20 Open product detail page', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/inventory.html`)
    await expect(page).toHaveURL(/inventory\.html/);
    await page.getByTestId('item-4-title-link').click()
    await expect(page).toHaveURL(/inventory-item\.html/)
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(['Sauce Labs Backpack'])
  })

  test('SAUC-T23 Add one item to cart', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])

    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    const removeButton = (pom.page.getByRole('button', { name: 'Remove' }))
    await expect(removeButton).toBeVisible()
  })

  test('SAUC-T24 Add all 6 items (max)', async ({ pom }) => {

    const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket', 'Sauce Labs Onesie', 'Test.allTheThings() T-Shirt (Red)'];

    await pom.addItemsToCart.addItemsToCart(items);
    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(String(items.length));

    await pom.page.locator('[data-test="shopping-cart-link"]').click()
    await pom.page.getByRole('button', { name: 'Checkout' }).click()
    await expect(pom.page.locator('.title')).toHaveText('Checkout: Your Information')

    await pom.checkOutFlow.checkoutFlow('Jason', 'Billones', '1123')

    await pom.page.getByRole('button', { name: 'Back Home' }).click()
  })

  test('SAUC-T25 Empty cart (0 items)', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/inventory.html`)
    await page.locator('[data-test="shopping-cart-link"]').click()

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0)
  })

  test('SAUC-T26 Remove item from inventory page', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])

    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    const removeButton = (pom.page.getByRole('button', { name: 'Remove' }))
    await expect(removeButton).toBeVisible()

    await removeButton.click();
    await expect(pom.page.getByRole('button', { name: 'Add to cart' }).first()).toBeVisible()
    await expect(pom.page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('aria-label', 'Cart, empty')
  })

  test('SAUC-T27 Remove item from cart page', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])

    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    await pom.page.locator('[data-test="shopping-cart-link"]').click()
    await expect(pom.page.getByRole('button', { name: 'Remove' })).toBeVisible()
    await pom.page.getByRole('button', { name: 'Remove' }).click()
    await expect(pom.page.locator('[data-test="inventory-item"]')).toHaveCount(0)
  })

  test('SAUC-T28 Cart persists after page refresh and navigation', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack']);
    await pom.cartPage.expectBadgeCount(1);

    await pom.page.reload();
    await pom.cartPage.expectBadgeCount(1);

    await pom.cartPage.open();
    await expect(pom.page).toHaveURL(/cart\.html/);
    await pom.cartPage.expectItemCount(1);

    await pom.cartPage.continueShopping();
    await expect(pom.page).toHaveURL(/inventory\.html/);
    await pom.cartPage.expectBadgeCount(1);


    await pom.cartPage.open();
    await pom.page.reload();
    await pom.cartPage.expectItemCount(1);
  })

  test('SAUC-T29 Continue Shopping returns to inventory', async ({ pom }) => {
    await pom.cartPage.open();
    await expect(pom.page).toHaveURL(/cart\.html/);

    await pom.cartPage.continueShopping();
    await expect(pom.page).toHaveURL(/inventory\.html/);
    await expect(pom.page.locator('[data-test="title"]')).toHaveText('Products');
  })

  test('SAUC-T30 End-to-end purchase (happy path)', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])
    await pom.cartPage.expectBadgeCount(1);

    await pom.cartPage.open()
    await expect(pom.page.locator('.cart_item').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await pom.cartPage.checkout()
    await pom.checkOutFlow.checkoutFlow('Jason', 'Billones', '1123');
  })

  test.fail('SAUC-T34 Checkout with empty cart', async ({ pom }) => {
    await pom.cartPage.open();
    await expect(pom.cartPage.expectItemCount(0));
    await pom.cartPage.checkout();
    await expect(pom.page).toHaveURL(/cart\.html/)
  })

  test('SAUC-T39 Back Home after order, cart cleared', async ({ pom }) => {
    await expect(pom.page).toHaveURL(/inventory\.html/);
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])
    await pom.cartPage.expectBadgeCount(1)

    await pom.cartPage.open()
    await expect(pom.page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await pom.cartPage.checkout()
    await pom.checkOutFlow.checkoutFlow('Jason', 'Billones', '1123');

    await pom.page.getByRole('button', { name: 'Back Home' }).click();
    await expect(pom.page).toHaveURL(/inventory\.html/);
    await expect(pom.cartPage.cartBadge).toBeHidden();

    await pom.cartPage.open();
    await pom.cartPage.expectEmpty();
  })

  test('SAUC-T44 Sort by name (Z-A)', async ({ pom }) => {

    const expectedNames = await pom.sortOption.getExpectedNames('desc')
    await pom.sortOption.sortBy('za')

    await expect(pom.sortOption.itemNames).toHaveText(expectedNames);
  })

  test('SAUC-T45 Sort by price (low-high)', async ({ pom }) => {

    const expectedPrices = await pom.sortOption.getExpectedPrices('asc')
    await pom.sortOption.sortBy('lohi')

    const actualPrices = await pom.sortOption.getItemPricesValues()

    expect(actualPrices).toEqual(expectedPrices);
  })
})
