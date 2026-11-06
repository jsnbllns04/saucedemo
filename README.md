# SauceDemo Test Automation

End-to-end test automation for [SauceDemo](https://www.saucedemo.com), built with **Playwright and TypeScript**. This is a practice project that follows the full testing process: test case design, tracking in Jira, automation, and CI.

## Overview

- **44 test cases** designed in Jira, using positive, negative, boundary and equivalence partitioning techniques
- All test cases automated with Playwright

## Test Coverage

| Area                                             | Spec file                      |
| ------------------------------------------------ | ------------------------------ |
| Login (valid and invalid credentials)            | `tests/login.spec.ts`          |
| Access control (inventory without login, logout) | `tests/access.spec.ts`         |
| Inventory, sorting, cart                         | `tests/inventory-cart.spec.ts` |
| Checkout flow and validation                     | `tests/checkout.spec.ts`       |
| Menu and footer links                            | `tests/menu-footer.spec.ts`    |
| Responsive layout                                | `tests/responsive.spec.ts`     |

## Tech and Approach

- Playwright Test with TypeScript
- Page Object Model (`page-objects/`) and custom fixtures (`fixtures.ts`)
- Data-driven tests for invalid login cases
- Login handled once in `tests/auth.setup.ts` and reused through saved authentication state
- Runs on Chromium, Firefox and WebKit
- CI with GitHub Actions on every push and pull request, with an HTML report uploaded as an artifact

## Getting Started

**Requirements:** Node.js (LTS)

```bash
git clone https://github.com/jsnbllns04/saucedemo.git
cd saucedemo
npm ci
npx playwright install
```

Create a `.env` file in the project root:

```
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
PASSWORD=secret_sauce
```

## Running the Tests

```bash
npx playwright test                    # run all tests
npx playwright test login.spec.ts      # run one file
npx playwright test --project=chromium # run one browser
npx playwright show-report             # open the HTML report
```

## Author

Jason Aubrey P. Billones, jsnbllns04@gmail.com
