import { test, expect } from '../fixtures';
import { CHECKOUT_INFO, LONG_LENGTH, TAX_RATE } from '../test-data';

const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
const { firstName, lastName, postalCode } = CHECKOUT_INFO;

test.describe('Checkout', () => {
    test.beforeEach(async ({ pom }) => {
        await pom.addItemsToCart.addItemsToCart(items)
        await pom.cartPage.expectBadgeCount(items.length)
        await pom.cartPage.open()
        await pom.cartPage.checkout()
        await expect(pom.checkOutFlow.title).toHaveText('Checkout: Your Information');
    })

    test('TC-031 First name empty', async ({ pom }) => {
        await pom.checkOutFlow.fillInformation('', lastName, postalCode);
        await pom.checkOutFlow.continue()
        await expect(pom.checkOutFlow.errorMessage).toHaveText('Error: First Name is required')
        await expect(pom.page).toHaveURL(/checkout-step-one\.html/);
    })

    test('TC-032 Last name empty', async ({ pom }) => {
        await pom.checkOutFlow.fillInformation(firstName, '', postalCode);
        await pom.checkOutFlow.continue()
        await expect(pom.checkOutFlow.errorMessage).toHaveText('Error: Last Name is required')
        await expect(pom.page).toHaveURL(/checkout-step-one\.html/);
    })

    test('TC-033 Postal code empty', async ({ pom }) => {
        await pom.checkOutFlow.fillInformation(firstName, lastName, '');
        await pom.checkOutFlow.continue()
        await expect(pom.checkOutFlow.errorMessage).toHaveText('Error: Postal Code is required')
        await expect(pom.page).toHaveURL(/checkout-step-one\.html/);
    })

    test('TC-035 Very long values in checkout fields (256+ chars)', async ({ pom }) => {
        const longValue = 'a'.repeat(LONG_LENGTH)

        await pom.checkOutFlow.fillInformation(longValue, longValue, longValue)
        await pom.checkOutFlow.continue()

        // SauceDemo has no length limit, so it should continue without breaking
        await expect(pom.checkOutFlow.title).toHaveText('Checkout: Overview');
        await expect(pom.checkOutFlow.itemPrices).toHaveCount(items.length);
    })

    const specialCases = [
        { name: 'numbers in names', first: '12345', last: '67890', postal: postalCode },
        { name: 'special characters in names', first: '!@#$%^&*()', last: '<>?:"{}|', postal: postalCode },
        { name: 'letters and symbols in postal code', first: firstName, last: lastName, postal: 'AB-12 #@!' },
    ];

    specialCases.forEach(({ name, first, last, postal }) => {
        test(`TC-036 Special characters / numbers: ${name}`, async ({ pom }) => {
            await pom.checkOutFlow.fillInformation(first, last, postal);
            await pom.checkOutFlow.continue();

            // SauceDemo has no format validation, so these are accepted
            await expect(pom.checkOutFlow.title).toHaveText('Checkout: Overview');
        })
    })

    test('TC-037 Order total calculation', async ({ pom }) => {
        await pom.checkOutFlow.fillInformation(firstName, lastName, postalCode);
        await pom.checkOutFlow.continue();
        await expect(pom.checkOutFlow.title).toHaveText('Checkout: Overview');

        const prices = await pom.checkOutFlow.getItemPrices();
        const { subtotal, tax, total } = await pom.checkOutFlow.getSummary();

        const expectedSubtotal = prices.reduce((sum, price) => sum + price, 0);
        expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(tax).toBeCloseTo(subtotal * TAX_RATE, 2);
        expect(total).toBeCloseTo(subtotal + tax, 2);
    })

    test('TC-038 Cancel on checkout info page', async ({ pom }) => {
        await pom.checkOutFlow.fillInformation(firstName, lastName, postalCode);
        await pom.checkOutFlow.cancel();

        await expect(pom.page).toHaveURL(/cart\.html/);
        await pom.cartPage.expectItemCount(items.length);
    })
})