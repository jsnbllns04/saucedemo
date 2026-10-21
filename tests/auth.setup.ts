import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {

    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.STANDARD_USER!)
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD!)
    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForURL('**/inventory.html')

    await page.context().storageState({ path: authFile });


}
);