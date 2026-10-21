import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly cartItems: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async open() {
        await this.cartLink.click()
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }
    async expectBadgeCount(count: number) {
        await expect(this.cartBadge).toHaveText(String(count));
    }

    async expectItemCount(count: number) {
        await expect(this.cartItems).toHaveCount(count);
    }

    async expectEmpty() {
        await expect(this.cartBadge).toBeHidden();
        await expect(this.cartItems).toHaveCount(0);
    }
}