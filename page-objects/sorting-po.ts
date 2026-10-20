import { Page, Locator } from "@playwright/test";

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class SortingFunction {

    readonly page: Page
    readonly sortDropdown: Locator
    readonly itemNames: Locator
    readonly itemPrices: Locator

    constructor(page: Page) {
        this.page = page;
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    }

    async sortBy(option: SortOption) {
        await this.sortDropdown.selectOption(option)
    }

    async getItemNames(): Promise<string[]> {
        await this.itemNames.first().waitFor()
        return this.itemNames.allTextContents()
    }

    async getExpectedNames(order: 'asc' | 'desc'): Promise<string[]> {
        const names = await this.getItemNames()
        return [...names].sort((a, b) =>
            order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
        )
    }
}