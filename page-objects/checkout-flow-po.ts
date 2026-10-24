import { Page, expect, Locator } from "@playwright/test"

export class CheckoutFlow {

    readonly page: Page
    readonly title: Locator
    readonly errorMessage: Locator
    readonly cancelButton: Locator
    readonly continueButton: Locator
    readonly itemPrices: Locator
    readonly subtotalLabel: Locator
    readonly taxLabel: Locator
    readonly totalLabel: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.locator('[data-test="title"]')
        this.errorMessage = page.locator('[data-test="error"]')
        this.cancelButton = page.locator('[data-test="cancel"]')
        this.continueButton = page.locator('[data-test="continue"]')
        this.itemPrices = page.locator('[data-test="inventory-item-price"]')
        this.subtotalLabel = page.locator('[data-test="subtotal-label"]')
        this.taxLabel = page.locator('[data-test="tax-label"]')
        this.totalLabel = page.locator('[data-test="total-label"]')

    }

    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName)
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName)
        await this.page.locator('[data-test="postalCode"]').fill(postalCode)
    }


    async continue() {
        await this.continueButton.click()
    }

    async cancel() {
        await this.cancelButton.click()
    }

    async finishOrder() {
        await this.page.getByRole('button', { name: 'Finish' }).click()
        await expect(this.page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!')
    }

    async checkoutFlow(firstName: string, lastName: string, postalCode: string) {
        await this.fillInformation(firstName, lastName, postalCode)
        await this.continue()
        await this.finishOrder()
    }

    private toNumber(text: string): number {
        return parseFloat(text.replace(/[^0-9.]/g, ''))
    }

    async getItemPrices(): Promise<number[]> {
        await this.itemPrices.first().waitFor()
        const texts = await this.itemPrices.allTextContents()
        return texts.map((t) => this.toNumber(t))
    }

    async getSummary() {
        return {
            subtotal: this.toNumber(await this.subtotalLabel.innerText()),
            tax: this.toNumber(await this.taxLabel.innerText()),
            total: this.toNumber(await this.totalLabel.innerText()),
        }
    }
}