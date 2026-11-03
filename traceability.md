# Traceability Matrix

Maps each Zephyr Scale test case (project `SAUC`) to the Playwright spec file that automates it. The Zephyr ID is at the start of each test title in the code.

| Zephyr ID | Test case | Area | Priority | Spec file | Notes |
|---|---|---|---|---|---|
| SAUC-T1 | Login with valid standard_user | Login | High | `tests/login.spec.ts` |  |
| SAUC-T3 | Locked out user cannot login | Login | High | `tests/login.spec.ts` |  |
| SAUC-T4 | Invalid username, valid password | Login | High | `tests/login.spec.ts` |  |
| SAUC-T5 | Valid username, wrong password | Login | High | `tests/login.spec.ts` |  |
| SAUC-T6 | Both fields empty | Login | High | `tests/login.spec.ts` |  |
| SAUC-T7 | Username empty, password filled | Login | Normal | `tests/login.spec.ts` |  |
| SAUC-T8 | Password empty, username filled | Login | Normal | `tests/login.spec.ts` |  |
| SAUC-T9 | Username is case sensitive | Login | Normal | `tests/login.spec.ts` |  |
| SAUC-T10 | Username with leading/trailing space | Login | Low | `tests/login.spec.ts` |  |
| SAUC-T11 | Very long username (256+ chars) | Login | Low | `tests/login.spec.ts` |  |
| SAUC-T12 | Special characters / injection strings in login | Login | Normal | `tests/login.spec.ts` |  |
| SAUC-T13 | Access inventory without logging in | Login | High | `tests/access.spec.ts` |  |
| SAUC-T14 | Password field is masked | Login | Low | `tests/access.spec.ts` |  |
| SAUC-T15 | Logout returns to login page | Login | High | `tests/menu-footer.spec.ts` |  |
| SAUC-T16 | performance_glitch_user login delay | Login | Normal | `tests/login.spec.ts` |  |
| SAUC-T17 | Inventory shows 6 products with name, price, image, button | Inventory | High | `tests/sauce.spec.ts` |  |
| SAUC-T18 | Sort by name (A-Z) | Inventory | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T19 | Sort by price (high-low) | Inventory | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T20 | Open product detail page | Inventory | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T21 | problem_user shows wrong product images | Inventory | Normal | `tests/access.spec.ts` | Known app bug (`test.fail`) |
| SAUC-T22 | visual_user layout differences | Inventory | Low | `tests/access.spec.ts` | Known app bug (`test.fail`) |
| SAUC-T23 | Add one item to cart | Cart | High | `tests/sauce.spec.ts` |  |
| SAUC-T24 | Add all 6 items (max) | Cart | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T25 | Empty cart (0 items) | Cart | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T26 | Remove item from inventory page | Cart | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T27 | Remove item from cart page | Cart | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T28 | Cart persists after page refresh and navigation | Cart | Low | `tests/sauce.spec.ts` |  |
| SAUC-T29 | Continue Shopping returns to inventory | Cart | Low | `tests/sauce.spec.ts` |  |
| SAUC-T30 | End-to-end purchase (happy path) | Checkout | High | `tests/sauce.spec.ts` |  |
| SAUC-T31 | First name empty | Checkout | High | `tests/checkout.spec.ts` |  |
| SAUC-T32 | Last name empty | Checkout | High | `tests/checkout.spec.ts` |  |
| SAUC-T33 | Postal code empty | Checkout | High | `tests/checkout.spec.ts` |  |
| SAUC-T34 | Checkout with empty cart | Checkout | Normal | `tests/sauce.spec.ts` | Known app bug (`test.fail`) |
| SAUC-T35 | Very long values in checkout fields (256+ chars) | Checkout | Low | `tests/checkout.spec.ts` |  |
| SAUC-T36 | Special characters / numbers in name and postal code | Checkout | Low | `tests/checkout.spec.ts` |  |
| SAUC-T37 | Order total calculation | Checkout | High | `tests/checkout.spec.ts` |  |
| SAUC-T38 | Cancel on checkout info page | Checkout | Normal | `tests/checkout.spec.ts` |  |
| SAUC-T39 | Back Home after order, cart cleared | Checkout | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T40 | Reset App State clears cart | Menu | Normal | `tests/menu-footer.spec.ts` |  |
| SAUC-T41 | About link | Menu | Low | `tests/menu-footer.spec.ts` |  |
| SAUC-T42 | Footer social links open correctly | UI | Low | `tests/menu-footer.spec.ts` |  |
| SAUC-T43 | Cross-browser and responsive layout | UI | Normal | `tests/responsive.spec.ts` |  |
| SAUC-T44 | Sort by name (Z-A) | Inventory | Normal | `tests/sauce.spec.ts` |  |
| SAUC-T45 | Sort by price (low-high) | Inventory | Normal | `tests/sauce.spec.ts` |  |
