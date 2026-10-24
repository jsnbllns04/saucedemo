import { Page } from '@playwright/test';
import { SortingFunction } from './sorting-po';
import { AddItemsToCart } from './add-to-cart-po';
import { CheckoutFlow } from './checkout-flow-po';
import { CartPage } from './cart-page-po';
import { LoginPage } from './login-po'
import { NavigationPage } from './navigation-po';
import { InventoryPage } from './inventory-po';

export class PageManager {

    readonly page: Page
    readonly sortOption: SortingFunction
    readonly addItemsToCart: AddItemsToCart
    readonly checkOutFlow: CheckoutFlow
    readonly cartPage: CartPage
    readonly loginPage: LoginPage
    readonly navigationPage: NavigationPage
    readonly inventoryPage: InventoryPage

    constructor(page: Page) {
        this.page = page
        this.sortOption = new SortingFunction(page)
        this.addItemsToCart = new AddItemsToCart(page)
        this.checkOutFlow = new CheckoutFlow(page)
        this.cartPage = new CartPage(page)
        this.loginPage = new LoginPage(page)
        this.inventoryPage = new InventoryPage(page)
        this.navigationPage = new NavigationPage(page)
    }
}