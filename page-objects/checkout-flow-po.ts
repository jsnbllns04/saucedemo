import { Page, expect } from "@playwright/test"

export class CheckoutFlow {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }


    async checkoutFlow(firstName: string, lastName: string, postalCode: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName)
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName)
        await this.page.locator('[data-test="postalCode"]').fill(postalCode)
        await this.page.locator('[data-test="continue"]').click()
        await this.page.getByRole('button', { name: 'Finish' }).click()

        await expect(this.page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!')
    }
}