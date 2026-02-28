import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  addToCartButton = this.page.locator('input[id^="add-to-cart-button"]');
  productPrice = this.page.locator('.product-price .price-value');
  quantityInput = this.page.locator('input.qty-input');

  async selectSimpleComputerDefaults() {
    await this.page.locator('label:has-text("Slow")').click();
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart() {
    await this.addToCartButton.click();

    await this.page.locator('.bar-notification.success').waitFor({ state: 'visible' });

    const closeBtn = this.page.locator('.bar-notification.success .close');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  }

  async getPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText?.replace('$', '').trim() || '0');
  }
}
