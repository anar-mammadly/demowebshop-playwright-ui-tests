import { test, expect } from '@playwright/test';
import products from '../data/products.json';

import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { OnePageCheckoutPage } from '../pages/OnePageCheckoutPage';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('Place order with multiple products and validate prices', () => {

  test('Order flow with price validation', async ({ page }) => {

    await page.goto('/');

    const home = new HomePage(page);
    const productPage = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const login = new LoginPage(page);
    const onepage = new OnePageCheckoutPage(page);
    const register = new RegistrationPage(page);

    await register.open();
    const email = await register.registerRandomUser();
    console.log("REGISTERED:", email);

    await login.login(email, process.env.DEFAULT_PASSWORD!);


    for (const item of products) {
      await home.openProduct(item.name);

      if (item.name === "Simple Computer") {
        await productPage.selectSimpleComputerDefaults();
      }

      await productPage.setQuantity(item.quantity);
      await productPage.addToCart();

      await page.goto('/');
    }

    await cart.openCart();

    for (let i = 0; i < products.length; i++) {
      await cart.assertPriceCalculation(i);
    }

    await cart.acceptTermsAndCheckout();

    await onepage.fillBillingAddress();
    
    await onepage.continueShippingAddress();
    await onepage.continueShippingMethod();
    await onepage.continuePaymentMethod();
    await onepage.continuePaymentInfo();

    await checkout.confirmOrder();

    const message = await checkout.getSuccessMessage();
    console.log("SUCCESS:", message);

    await expect(message).toContain('Your order has been successfully processed!');
  });

});
