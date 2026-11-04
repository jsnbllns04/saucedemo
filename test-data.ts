export const PASSWORD = process.env.PASSWORD!;

export const USERS = {
  standard: process.env.STANDARD_USER!,
  problem: 'problem_user',
  visual: 'visual_user',
  locked: 'locked_out_user',
  performance: 'performance_glitch_user'
};

export const CHECKOUT_INFO = { firstName: 'Jason', lastName: 'Billones', postalCode: '1123' };

export const LONG_LENGTH = 256;
export const TAX_RATE = 0.08;

type Product = {
  name: string;
  description: string;
  price: string;
  addToCartId: string;
}
export const productInformation: Product[] = [
  {
    name: 'Sauce Labs Backpack',
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: '$29.99',
    addToCartId: 'add-to-cart-sauce-labs-backpack',
  },
  {
    name: 'Sauce Labs Bike Light',
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: '$9.99',
    addToCartId: 'add-to-cart-sauce-labs-bike-light',
  },
  {
    name: 'Sauce Labs Bolt T-Shirt',
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: '$15.99',
    addToCartId: 'add-to-cart-sauce-labs-bolt-t-shirt',
  },
  {
    name: 'Sauce Labs Fleece Jacket',
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    price: '$49.99',
    addToCartId: 'add-to-cart-sauce-labs-fleece-jacket',
  },
  {
    name: 'Sauce Labs Onesie',
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: '$7.99',
    addToCartId: 'add-to-cart-sauce-labs-onesie',
  },
  {
    name: 'Test.allTheThings() T-Shirt (Red)',
    description:
      'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    price: '$15.99',
    addToCartId: 'add-to-cart-test.allthethings()-t-shirt-(red)',
  },
]
