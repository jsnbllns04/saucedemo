import { Page, Locator } from '@playwright/test'

export type SocialName = 'twitter' | 'facebook' | 'linkedin';

export class NavigationPage {
    readonly page: Page;
    readonly menuButton: Locator;
    readonly aboutLink: Locator;
    readonly logoutLink: Locator;
    readonly resetLink: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
        this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
        this.footer = page.locator('[data-test="footer"]');
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
    }

    async about() {
        await this.openMenu();
        await this.aboutLink.click();
    }

    async resetAppState() {
        await this.openMenu();
        await this.resetLink.click();
    }

    socialLink(name: SocialName): Locator {
        return this.page.locator(`[data-test="social-${name}"]`);
    }
    async openSocialLink(name: SocialName): Promise<Page> {
        const [popup] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.socialLink(name).click(),
        ]);
        return popup;
    }
}