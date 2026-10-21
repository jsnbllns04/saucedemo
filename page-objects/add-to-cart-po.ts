import { Locator, Page } from "@playwright/test"

export class AddItemsToCart {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }
    
    async addItemsToCart(itemNames: string[]) {
        for (const name of itemNames) {
            const item = this.page.locator('.inventory_item', { hasText: name });
            
            await item.getByRole('button', { name: 'Add to cart' }).click();
        }
    }
}