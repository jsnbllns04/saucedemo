import { test as base } from '@playwright/test';
import { PageManager } from './page-objects/page-manager';

type FixtureTypes = {
    pom: PageManager
}

export const test = base.extend<FixtureTypes>({

    pom: async({page}, use) => {
        await page.goto('/inventory.html')
        const manager = new PageManager(page)
        await use(manager)

    }
})

export { expect } from '@playwright/test'