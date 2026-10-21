import { test, expect } from '../fixtures';

type Product = {
  name: string;
  description: string;
  price: string;
  addToCartId: string;
}
const productInformation: Product[] = [
  {
    name: 'Sauce Labs Backpack',
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: '$29.99',
    addToCartId: 'add-to-cart-sauce-labs-backpack',
  },
  {
    name: 'Sauce Labs Bike Light',
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: '$9.99',
    addToCartId: 'add-to-cart-sauce-labs-bike-light',
  },
  {
    name: 'Sauce Labs Bolt T-Shirt',
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: '$15.99',
    addToCartId: 'add-to-cart-sauce-labs-bolt-t-shirt',
  },
  {
    name: 'Sauce Labs Fleece Jacket',
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    price: '$49.99',
    addToCartId: 'add-to-cart-sauce-labs-fleece-jacket',
  },
  {
    name: 'Sauce Labs Onesie',
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: '$7.99',
    addToCartId: 'add-to-cart-sauce-labs-onesie',
  },
  {
    name: 'Test.allTheThings() T-Shirt (Red)',
    description:
      'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    price: '$15.99',
    addToCartId: 'add-to-cart-test.allthethings()-t-shirt-(red)',
  },
]

test.describe('Sorting and adding items to cart', () => {
  test('TC-017 Inventory shows 6 products with name, price, image, button', async ({ page }) => {
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

  test('TC-018 Sort by name (A-Z)', async ({ pom }) => {

    const expectedNames = await pom.sortOption.getExpectedNames('asc')
    await pom.sortOption.sortBy('az')

    await expect(pom.sortOption.itemNames).toHaveText(expectedNames);
  })

  test('TC-019 Sort by price (high-low)', async ({ pom }) => {

    const expectedPrices = await pom.sortOption.getExpectedPrices('desc')
    await pom.sortOption.sortBy('hilo')

    const actualPrices = await pom.sortOption.getItemPricesValues()

    expect(actualPrices).toEqual(expectedPrices);
  })


  test('TC-020 Open product detail page', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/inventory.html`)
    await page.locator('[data-test="inventory-item-name"]').first().click()

    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
  })

  test('TC-023 Add one item to cart', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])

    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    const removeButton = (pom.page.getByRole('button', { name: 'Remove' }))
    await expect(removeButton).toBeVisible()
  })

  test('TC-024 Add all 6 items (max)', async ({ pom }) => {

    const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket', 'Sauce Labs Onesie', 'Test.allTheThings() T-Shirt (Red)'];

    await pom.addItemsToCart.addItemsToCart(items);
    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(String(items.length));

    await pom.page.locator('[data-test="shopping-cart-link"]').click()
    await pom.page.getByRole('button', { name: 'Checkout' }).click()
    await expect(pom.page.locator('.title')).toHaveText('Checkout: Your Information')

    await pom.checkOutFlow.checkoutFlow('Jason', 'Billones', '1123')

    await pom.page.getByRole('button', { name: 'Back Home' }).click()
  })

  test('TC-025 Empty cart (0 items)', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/inventory.html`)
    await page.locator('[data-test="shopping-cart-link"]').click()

    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0)
  })

  test('TC-026 Remove item from inventory page', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])

    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    const removeButton = (pom.page.getByRole('button', { name: 'Remove' }))
    await expect(removeButton).toBeVisible()

    await removeButton.click();
    await expect(pom.page.getByRole('button', { name: 'Add to cart' }).first()).toBeVisible()
    await expect(pom.page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('aria-label', 'Cart, empty')
  })

  test('TC-027 Remove item from cart page', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])

    await expect(pom.page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    await pom.page.locator('[data-test="shopping-cart-link"]').click()
    await expect(pom.page.getByRole('button', { name: 'Remove' })).toBeVisible()
    await pom.page.getByRole('button', { name: 'Remove' }).click()
    await expect(pom.page.locator('[data-test="inventory-item"]')).toHaveCount(0)
  })

  test('TC-028 Cart persists after page refresh and navigation', async ({ pom }) => {
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

    // Refresh on the cart page
    await pom.cartPage.open();
    await pom.page.reload();
    await pom.cartPage.expectItemCount(1);
  })

  test('TC-029 Continue Shopping returns to inventory', async ({ pom }) => {
    await pom.cartPage.open();
    await expect(pom.page).toHaveURL(/cart\.html/);

    await pom.cartPage.continueShopping();
    await expect(pom.page).toHaveURL(/inventory\.html/);
    await expect(pom.page.locator('[data-test="title"]')).toHaveText('Products');
  })

  test('TC-030 End-to-end purchase (happy path)', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])
    pom.cartPage.expectBadgeCount(1);

    await pom.cartPage.open()
    await expect(pom.page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await pom.cartPage.checkout()
    await pom.checkOutFlow.checkoutFlow('Jason', 'Billones', '1123');
  })

  test.fail('TC-034 Checkout with empty cart', async ({ pom }) => {
    pom.cartPage.expectBadgeCount(0);
    await pom.cartPage.open();
    pom.cartPage.expectItemCount(0);
    await pom.cartPage.checkout();
  })

  test('TC-039 Back Home after order, cart cleared', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(['Sauce Labs Backpack'])
    pom.cartPage.expectBadgeCount(1)

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

  test('TC-44 Sort by name (Z-A)', async ({ pom }) => {

    const expectedNames = await pom.sortOption.getExpectedNames('desc')
    await pom.sortOption.sortBy('za')

    await expect(pom.sortOption.itemNames).toHaveText(expectedNames);
  })

  test('TC-45 Sort by price (low-high)', async ({ pom }) => {

    const expectedPrices = await pom.sortOption.getExpectedPrices('asc')
    await pom.sortOption.sortBy('lohi')

    const actualPrices = await pom.sortOption.getItemPricesValues()

    expect(actualPrices).toEqual(expectedPrices);
  })
})
