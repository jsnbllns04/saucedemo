import { test, expect } from '@playwright/test';
import { PASSWORD, USERS } from '../test-data';


test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('SAUC-T1 Login with valid standard_user', async ({ page }) => {
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
            id: 'SAUC-T4',
            name: 'wrong username',
            username: 'wrong_user',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'SAUC-T9',
            name: 'case sensitive username',
            username: 'STANDARD_USER',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'SAUC-T5',
            name: 'wrong password',
            username: process.env.STANDARD_USER!,
            password: 'wrong_password',
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'SAUC-T7',
            name: 'empty username',
            username: '',
            password: process.env.PASSWORD!,
            error: 'Username is required',
        },
        {
            id: 'SAUC-T8',
            name: 'empty password',
            username: process.env.STANDARD_USER!,
            password: '',
            error: 'Password is required',
        },
        {
            id: 'SAUC-T6',
            name: 'both fields empty',
            username: '',
            password: '',
            error: 'Username is required',
        },
        {
            id: 'SAUC-T3',
            name: 'locked out user',
            username: 'locked_out_user',
            password: process.env.PASSWORD!,
            error: 'Sorry, this user has been locked out',
        },
        {
            id: 'SAUC-T10',
            name: 'username with leading and trailing space',
            username: ' standard_user ',
            password: process.env.PASSWORD!,
            error: 'Username and password do not match any user in this service'
        },
        {
            id: 'SAUC-T11',
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
        test(`SAUC-T12 Special characters / injection strings in login: ${name}`, async ({ page }) => {

            await page.getByRole('textbox', { name: 'Username' }).fill(username);
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.getByRole('button', { name: 'Login' }).click();

            await expect(page.locator('[data-test="error"]')).toContainText(
                'Username and password do not match any user in this service'
            );
            await expect(page).not.toHaveURL(/inventory\.html/);
        });
    });

    test('SAUC-T16 performance_glitch_user login delay', async ({ page }) => {
        const MAX_LOGIN_MS = 10_000; // generous limit so slow CI runners do not cause false failures

        await page.getByRole('textbox', { name: 'Username' }).fill(USERS.performance);
        await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);

        const start = Date.now();
        await page.getByRole('button', { name: 'Login' }).click();

        await page.waitForURL(/inventory\.html/, { timeout: MAX_LOGIN_MS });
        const duration = Date.now() - start;

        // Record the measured time in the HTML report (Zephyr step: "record time")
        test.info().annotations.push({ type: 'login-time', description: `${duration} ms` });

        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })
})