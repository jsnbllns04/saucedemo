import { Page } from '@playwright/test';
import { SortingPage } from './sorting-po';
import { CartActions } from './add-to-cart-po';
import { CheckoutFlow } from './checkout-flow-po';
import { CartPage } from './cart-page-po';
import { LoginPage } from './login-po'
import { NavigationPage } from './navigation-po';
import { InventoryPage } from './inventory-po';

export class PageManager {
    readonly page: Page
    readonly sortOption: SortingPage
    readonly addItemsToCart: CartActions
    readonly checkOutFlow: CheckoutFlow
    readonly cartPage: CartPage
    readonly loginPage: LoginPage
    readonly navigationPage: NavigationPage
    readonly inventoryPage: InventoryPage

    constructor(page: Page) {
        this.page = page
        this.sortOption = new SortingPage(page)
        this.addItemsToCart = new CartActions(page)
        this.checkOutFlow = new CheckoutFlow(page)
        this.cartPage = new CartPage(page)
        this.loginPage = new LoginPage(page)
        this.inventoryPage = new InventoryPage(page)
        this.navigationPage = new NavigationPage(page)
    }
}