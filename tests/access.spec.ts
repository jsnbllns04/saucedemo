import { test, expect } from '../fixtures';
import { USERS, PASSWORD } from '../test-data';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Access & user types', () => {
  test('SAUC-T13 Access inventory without logging in', async ({ pom }) => {
    await pom.inventoryPage.openInventoryPage();

    await expect(pom.page).toHaveURL('/');
    await expect(pom.loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in",
    );
    await expect(pom.loginPage.loginButton).toBeVisible();
  });

  test('SAUC-T14 Password field is masked', async ({ pom }) => {
    await pom.loginPage.open();
    await pom.loginPage.passwordInput.fill(PASSWORD);

    // Masked: the browser hides characters only for type="password"
    await expect(pom.loginPage.passwordInput).toHaveAttribute('type', 'password');

    // The field still accepted the input
    await expect(pom.loginPage.passwordInput).toHaveValue(PASSWORD);
  });

  test('SAUC-T21 problem_user shows wrong product images', async ({ pom }) => {
    test.fail();
    await pom.loginPage.open();
    await pom.loginPage.login(USERS.problem, PASSWORD);
    await expect(pom.inventoryPage.title).toHaveText('Products');

    const sources = await pom.inventoryPage.getImageSources();

    // Every product should have its own image
    expect(new Set(sources).size).toBe(sources.length);
  });

  test.fail('SAUC-T22 visual_user layout differences', async ({ pom }) => {
    await pom.inventoryPage.openInventoryPage();
    await pom.loginPage.login(USERS.standard, PASSWORD);
    const standardLayout = await pom.inventoryPage.getLayout();
    const standardShot = await pom.page.screenshot({ fullPage: true, animations: 'disabled' });
    await pom.navigationPage.logout();

    // Same page as visual_user
    await pom.loginPage.login(USERS.visual, PASSWORD);
    await expect(pom.inventoryPage.title).toHaveText('Products');
    const visualLayout = await pom.inventoryPage.getLayout();
    const visualShot = await pom.page.screenshot({ fullPage: true, animations: 'disabled' });

    // Zephyr step: "record any visual differences with screenshots" -> attach both to the report
    await test
      .info()
      .attach('standard_user-inventory', { body: standardShot, contentType: 'image/png' });
    await test
      .info()
      .attach('visual_user-inventory', { body: visualShot, contentType: 'image/png' });

    expect(visualLayout).toEqual(standardLayout);
    // Soft assertions so both checks are reported (known bug: visual_user differs)
    expect.soft(visualLayout).toEqual(standardLayout);
    expect
      .soft(visualShot.equals(standardShot), 'visual_user page looks identical to standard_user')
      .toBe(true);
  });
});
