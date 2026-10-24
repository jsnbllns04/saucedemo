import { test, expect } from '../fixtures';

const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

const socialLinks = [
  { name: 'twitter', url: /(twitter|x)\.com\/saucelabs/ },
  { name: 'facebook', url: /facebook\.com\/saucelabs/ },
  { name: 'linkedin', url: /linkedin\.com/ },
] as const;


test.describe('Menu and Footer', () => {

  test('TC-015 Logout returns to login page', async ({ pom }) => {
    await pom.navigationPage.logout();

    await expect(pom.page).toHaveURL('/');
    await pom.inventoryPage.openInventoryPage();
    await expect(pom.page).toHaveURL('/');
    await expect(pom.loginPage.errorMessage).toContainText('You can only access');
  })

  test('TC-040 Reset App State clears cart', async ({ pom }) => {
    await pom.addItemsToCart.addItemsToCart(items)
    await pom.cartPage.expectBadgeCount(items.length)
    await pom.navigationPage.resetAppState();

    await expect(pom.cartPage.cartBadge).toBeHidden();
    await pom.cartPage.open();
    await pom.cartPage.expectEmpty();
  })

  test('TC-041 About link', async ({ pom }) => {
    await pom.navigationPage.about()
    await expect(pom.page).toHaveURL(/saucelabs\.com/);
  })

  socialLinks.forEach(({ name, url }) => {
    test(`TC-042 Footer social link opens correctly: ${name}`, async ({ pom }) => {
      await expect(pom.navigationPage.footer).toBeVisible();

      const popup = await pom.navigationPage.openSocialLink(name);
      await expect(popup).toHaveURL(url);

      await popup.close();
      await expect(pom.page).toHaveURL(/inventory\.html/);
    })
  })
})