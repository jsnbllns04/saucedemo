import { test, expect } from '../fixtures';

const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

const socialLinks = [
  { name: 'x', url: /x\.com\/saucelabs/ },
  { name: 'facebook', url: /facebook\.com\/saucelabs/ },
  { name: 'linkedin', url: /linkedin\.com/ },
] as const;


test.describe('Menu and Footer', () => {

  test('SAUC-T15 Logout returns to login page', async ({ pom }) => {
    await pom.navigationPage.logout();

    await expect(pom.page).toHaveURL('/');
    await pom.inventoryPage.openInventoryPage();
    await expect(pom.page).toHaveURL('/');
    await expect(pom.loginPage.errorMessage).toContainText('You can only access');
  })

  test('SAUC-T40 Reset App State clears cart', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(items)
    await pom.cartPage.expectBadgeCount(items.length)
    await pom.navigationPage.resetAppState();

    await expect(pom.cartPage.cartBadge).toBeHidden();
    await pom.cartPage.open();
    await pom.cartPage.expectEmpty();
  })

  test('SAUC-T41 About link', async ({ pom }) => {
    await pom.navigationPage.about()
    await expect(pom.page).toHaveURL(/saucelabs\.com/);
  })

  socialLinks.forEach(({ name, url }) => {
    test(`SAUC-T42 Footer social link opens correctly: ${name}`, async ({ pom }) => {
      await expect(pom.navigationPage.footer).toBeVisible();
      const link = pom.navigationPage.socialLink(name);
      await expect(link).toHaveAttribute('href', url);
      await expect(link).toHaveAttribute('target', '_blank');
    })
  })
})