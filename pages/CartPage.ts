import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartLink = this.page.locator('a.ico-cart').first();

  productRows = this.page.locator('.cart-item-row');

  termsCheckbox = this.page.locator('#termsofservice');
  checkoutButton = this.page.locator('button.checkout-button');

  async openCart() {
    await this.cartLink.click();
  }

  async acceptTermsAndCheckout() {
    await this.termsCheckbox.check();
    await this.checkoutButton.click();
  }

  async getProductPrice(row: number): Promise<number> {
    const priceText = await this.productRows.nth(row).locator('.product-unit-price').textContent();
    return parseFloat(priceText?.replace('$', '').trim() || '0');
  }

  async getProductQuantity(row: number): Promise<number> {
    const value = await this.productRows.nth(row).locator('.qty-input').inputValue();
    return parseInt(value || '0');
  }

  async getSubtotal(row: number): Promise<number> {
    const subtotalText = await this.productRows.nth(row).locator('.product-subtotal').textContent();
    return parseFloat(subtotalText?.replace('$', '').trim() || '0');
  }

  async assertPriceCalculation(row: number) {
    const unitPrice = await this.getProductPrice(row);
    const quantity = await this.getProductQuantity(row);
    const subtotal = await this.getSubtotal(row);

    if (unitPrice * quantity !== subtotal) {
      throw new Error(`Price mismatch in row ${row}: ${unitPrice} * ${quantity} != ${subtotal}`);
    }
  }
}
