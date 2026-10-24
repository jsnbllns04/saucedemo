import { Page, Locator } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly images: Locator;
    readonly sortContainer: Locator;
    readonly items: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.items = page.locator('[data-test="inventory-item"]');
        this.images = page.locator('.inventory_item_img img');
        this.sortContainer = page.locator('[data-test="product-sort-container"]');
    }

    async openInventoryPage() {
        await this.page.goto('/inventory.html');
    }

    async getImageSources(): Promise<string[]> {
        await this.images.first().waitFor();
        return this.images.evaluateAll((imgs) =>
            imgs.map((img) => img.getAttribute('src') ?? '')
        );
    }

    async getLayout() {
        await this.items.first().waitFor();
        const targets: Record<string, Locator> = {
            header: this.page.locator('[data-test="primary-header"]'),
            cart: this.page.locator('[data-test="shopping-cart-link"]'),
            sort: this.sortContainer,
            firstName: this.page.locator('[data-test="inventory-item-name"]').first(),
            firstPrice: this.page.locator('[data-test="inventory-item-price"]').first(),
            firstButton: this.page.getByRole('button', { name: 'Add to cart' }).first(),
        };

        const layout: Record<string, unknown> = {};
        for (const [key, locator] of Object.entries(targets)) {
            layout[key] = await locator.boundingBox();
        }
        return layout;
    }
}