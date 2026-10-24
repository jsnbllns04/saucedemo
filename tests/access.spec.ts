import { test, expect } from '../fixtures'
import { USERS, PASSWORD } from '../test-data';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Access & user types', () => {

    test('TC-013 Access inventory without logging in', async ({ pom }) => {
        await pom.inventoryPage.openInventoryPage()

        await expect(pom.page).toHaveURL('/');
        await expect(pom.loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in");
        await expect(pom.loginPage.loginButton).toBeVisible();
    })

    test.fail('TC-022 visual_user layout differences', async ({ pom }) => {
        await pom.inventoryPage.openInventoryPage()
        await pom.loginPage.login(USERS.standard, PASSWORD);
        const standardLayout = await pom.inventoryPage.getLayout();
        await pom.navigationPage.logout();

        // Same page as visual_user
        await pom.loginPage.login(USERS.visual, PASSWORD);
        await expect(pom.inventoryPage.title).toHaveText('Products');
        const visualLayout = await pom.inventoryPage.getLayout();

        expect(visualLayout).toEqual(standardLayout);
    })
})