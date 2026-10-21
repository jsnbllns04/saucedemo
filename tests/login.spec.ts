import { test, expect } from '@playwright/test';


test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('Valid login redirects to inventory page', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
        await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD!);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
        await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    const invalidCases = [
        {
            name: 'wrong username',
            username: 'wrong_user',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            name: 'wrong password',
            username: process.env.STANDARD_USER!,
            password: 'wrong_password',
            error: 'Username and password do not match any user in this service'
        }, {
            name: 'empty username',
            username: '',
            password: process.env.PASSWORD!,
            error: 'Username is required',
        },
        {
            name: 'empty password',
            username: process.env.STANDARD_USER!,
            password: '',
            error: 'Password is required',
        },
        {
            name: 'both fields empty',
            username: '',
            password: '',
            error: 'Username is required',
        },
        {
            name: 'locked out user',
            username: 'locked_out_user',
            password: process.env.PASSWORD!,
            error: 'Sorry, this user has been locked out',
        },
    ]

    invalidCases.forEach(({ name, username, password, error }) => {
        test(`Invalid login: ${name}`, async ({ page }) => {
            await page.getByRole('textbox', { name: 'Username' }).fill(username);
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.getByRole('button', { name: 'Login' }).click();

            await expect(page.locator('[data-test="error"]')).toContainText(error);
            await expect(page).not.toHaveURL(/inventory\.html/);
        });
    })
})