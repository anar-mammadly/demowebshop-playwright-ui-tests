import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OnePageCheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  existingAddressDropdown = this.page.locator('#billing-address-select');

  firstName = this.page.locator('#BillingNewAddress_FirstName');
  lastName = this.page.locator('#BillingNewAddress_LastName');
  email = this.page.locator('#BillingNewAddress_Email');
  country = this.page.locator('#BillingNewAddress_CountryId');
  city = this.page.locator('#BillingNewAddress_City');
  address1 = this.page.locator('#BillingNewAddress_Address1');
  zip = this.page.locator('#BillingNewAddress_ZipPostalCode');
  phone = this.page.locator('#BillingNewAddress_PhoneNumber');

  continueBilling = this.page.locator('#billing-buttons-container input.button-1');
  continueShippingAddressBtn = this.page.locator('#shipping-buttons-container input.button-1');
  continueShippingMethodBtn = this.page.locator('#shipping-method-buttons-container input.button-1');
  continuePaymentMethodBtn = this.page.locator('#payment-method-buttons-container input.button-1');
  continuePaymentInfoBtn = this.page.locator('#payment-info-buttons-container input.button-1');

  async fillBillingAddress() {

    if (await this.existingAddressDropdown.isVisible()) {
      const options = await this.existingAddressDropdown.locator('option').count();

      if (options > 1) {
        await this.existingAddressDropdown.selectOption({ index: 1 });
        await this.continueBilling.click();
        return;
      }
    }

    await this.firstName.fill('Anar');
    await this.lastName.fill('Mammadov');
    await this.email.fill(`anarmammadly+${Date.now()}@gmail.com`);
    await this.country.selectOption({ label: 'Azerbaijan' });
    await this.city.fill('Baku');
    await this.address1.fill('Khatai district');
    await this.zip.fill('1000');
    await this.phone.fill('0550000000');

    await this.continueBilling.click();
  }

  async continueShippingAddress() {
    await this.continueShippingAddressBtn.waitFor({ state: 'visible' });
    await this.continueShippingAddressBtn.click();
  }

  async continueShippingMethod() {
    await this.continueShippingMethodBtn.waitFor({ state: 'visible' });
    await this.continueShippingMethodBtn.click();
  }

  async continuePaymentMethod() {
    await this.continuePaymentMethodBtn.waitFor({ state: 'visible' });
    await this.continuePaymentMethodBtn.click();
  }

  async continuePaymentInfo() {
    await this.continuePaymentInfoBtn.waitFor({ state: 'visible' });
    await this.continuePaymentInfoBtn.click();
  }
}
