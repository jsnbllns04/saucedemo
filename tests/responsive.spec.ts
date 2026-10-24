import { test, expect } from '../fixtures';

const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
];

// SAUC-T43
viewports.forEach(({ name, width, height }) => {
    test(`TC-043 Responsive layout: ${name} (${width}x${height})`, async ({ pom }) => {
        await pom.page.setViewportSize({ width, height });
        await pom.inventoryPage.openInventoryPage();

        await expect(pom.inventoryPage.title).toBeVisible();
        await expect(pom.navigationPage.menuButton).toBeVisible();
        await expect(pom.cartPage.cartLink).toBeVisible();
        await expect(pom.inventoryPage.sortContainer).toBeVisible();
        await expect(pom.inventoryPage.items.first()).toBeVisible();
        await expect(pom.navigationPage.footer).toBeVisible();

        // No horizontal scrolling
        const hasHorizontalScroll = await pom.page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(hasHorizontalScroll).toBe(false);
    });
});