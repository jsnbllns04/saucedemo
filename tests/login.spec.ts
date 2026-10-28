import { test, expect } from '@playwright/test';


test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('TC-001 Login with valid standard_user', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!);
        await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD!);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
        await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    const maxLength = 256;

    const invalidCases = [
        {
            id: 'TC-004',
            name: 'wrong username',
            username: 'wrong_user',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'TC-009',
            name: 'case sensitive username',
            username: 'STANDARD_USER',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'TC-005',
            name: 'wrong password',
            username: process.env.STANDARD_USER!,
            password: 'wrong_password',
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'TC-007',
            name: 'empty username',
            username: '',
            password: process.env.PASSWORD!,
            error: 'Username is required',
        },
        {
            id: 'TC-008',
            name: 'empty password',
            username: process.env.STANDARD_USER!,
            password: '',
            error: 'Password is required',
        },
        {
            id: 'TC-006',
            name: 'both fields empty',
            username: '',
            password: '',
            error: 'Username is required',
        },
        {
            id: 'TC-003',
            name: 'locked out user',
            username: 'locked_out_user',
            password: process.env.PASSWORD!,
            error: 'Sorry, this user has been locked out',
        },
        {
            id: 'TC-010',
            name: 'username with leading and trailing space',
            username: ' standard_user ',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'TC-011',
            name: 'Very long username (256+ chars)',
            username: 'a'.repeat(maxLength),
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },

    ]

    invalidCases.forEach(({ id, name, username, password, error }) => {
        test(`${id} Invalid login: ${name}`, async ({ page }) => {
            await page.getByRole('textbox', { name: 'Username' }).fill(username);
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.getByRole('button', { name: 'Login' }).click();

            await expect(page.locator('[data-test="error"]')).toContainText(error);
            await expect(page).not.toHaveURL(/inventory\.html/);
        });
    })


    const injectionCases = [
        { name: 'SQL injection (OR 1=1)', username: "' OR '1'='1", password: "' OR '1'='1" },
        { name: 'SQL injection (comment)', username: "admin'--", password: 'anything' },
        { name: 'XSS script tag', username: '<script>alert(1)</script>', password: process.env.PASSWORD! },
        { name: 'HTML tag', username: '<b>bold</b>', password: process.env.PASSWORD! },
        { name: 'special characters', username: '!@#$%^&*()_+{}[]|\\:;"<>,.?/~`', password: process.env.PASSWORD! },
        { name: 'whitespace only', username: '   ', password: process.env.PASSWORD! },
        { name: 'unicode / emoji', username: '用户😀', password: process.env.PASSWORD! },
    ];

    injectionCases.forEach(({ name, username, password }) => {
        test(`TC-012 Special characters / injection strings in login: ${name}`, async ({ page }) => {

            await page.getByRole('textbox', { name: 'Username' }).fill(username);
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.getByRole('button', { name: 'Login' }).click();

            await expect(page.locator('[data-test="error"]')).toContainText(
                'Username and password do not match any user in this service'
            );
            await expect(page).not.toHaveURL(/inventory\.html/);
        });
    });

    test('TC-016 performance_glitch_user login delay', async ({ page }) => {
        const start = Date.now();
        await page.getByRole('textbox', { name: 'Username' }).fill('performance_glitch_user');
        await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForURL(/inventory\.html/);
        const duration = Date.now() - start;

        expect(duration).toBeLessThan(6000);
    })
})