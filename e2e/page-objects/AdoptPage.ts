import { Page, Locator } from '@playwright/test';

/**
 * Page Object for: Adopt (Virtual Adoption Wizard)
 * Route: /virtualAdopt/:id
 * Framework: react / antd (Ant Design)
 * Source: src/app/features/adopt/Adopt.jsx
 * Generated: 2026-05-19
 */
export class AdoptPage {
  readonly page: Page;
  readonly url = '/virtualAdopt';

  // ── Step indicator ─────────────────────────────────────────────────────
  readonly steps: Locator;

  // ── Step 0: Applicant Info ─────────────────────────────────────────────
  readonly fullNameInput: Locator;   // Full Name * — antd Input
  readonly ageInput: Locator;        // Age * — antd InputNumber
  readonly phoneInput: Locator;      // Phone * — antd Input
  readonly lineIdInput: Locator;     // Line ID (optional) — antd Input

  // ── Step 1: Home Environment ───────────────────────────────────────────
  readonly homeTypeHouseButton: Locator;  // Home Style — Radio.Button "House"
  readonly homeTypeCondoButton: Locator;  // Home Style — Radio.Button "Condo"
  readonly homeTypeOtherButton: Locator;  // Home Style — Radio.Button "Other"
  readonly hasPetsSelect: Locator;        // Do you have other pets? — antd Select
  readonly petDetailsTextArea: Locator;   // Pet Details (conditional) — antd TextArea

  // ── Step 2: Review & Submit ────────────────────────────────────────────
  readonly agreeCheckbox: Locator;        // I agree to the terms and conditions

  // ── Wizard nav buttons ─────────────────────────────────────────────────
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly submitButton: Locator;

  // ── Result states ──────────────────────────────────────────────────────
  readonly successResult: Locator;        // Application Submitted!
  readonly errorResult: Locator;          // Error Loading Cat
  readonly backToHomeLink: Locator;       // Back to Home (success state)

  constructor(page: Page) {
    this.page = page;

    this.steps = page.locator('.adopt-steps');

    // Step 0
    this.fullNameInput   = page.locator('input[name="fullName"]');
    this.ageInput        = page.locator('.ant-input-number input');
    this.phoneInput      = page.locator('input[name="phone"]');
    this.lineIdInput     = page.locator('input[name="lineId"]');

    // Step 1
    this.homeTypeHouseButton = page.locator('.ant-radio-button-wrapper').filter({ hasText: 'House' });
    this.homeTypeCondoButton = page.locator('.ant-radio-button-wrapper').filter({ hasText: 'Condo' });
    this.homeTypeOtherButton = page.locator('.ant-radio-button-wrapper').filter({ hasText: 'Other' });
    this.hasPetsSelect       = page.locator('.form-field')
      .filter({ hasText: 'Do you have other pets?' })
      .locator('.ant-select');
    this.petDetailsTextArea  = page.locator('textarea[name="petDetails"]');

    // Step 2
    this.agreeCheckbox = page.locator('input[name="agree"]');

    // Buttons
    this.nextButton     = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.submitButton   = page.getByRole('button', { name: 'Submit Application' });

    // Results
    this.successResult  = page.locator('.ant-result-success');
    this.errorResult    = page.locator('.ant-result-error');
    this.backToHomeLink = page.getByRole('link', { name: 'Back to Home' });
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  async navigate(catId: string) {
    await this.page.goto(`${this.url}/${catId}`);
    await this.waitForLoad();
  }

  async waitForLoad() {
    await this.page.waitForSelector('.adopt-form, .ant-result', { state: 'visible' });
  }

  // ── Step 0 actions ─────────────────────────────────────────────────────
  async fillFullName(value: string) {
    await this.fullNameInput.fill(value);
  }

  async fillAge(value: number) {
    await this.ageInput.fill(String(value));
  }

  async fillPhone(value: string) {
    await this.phoneInput.fill(value);
  }

  async fillLineId(value: string) {
    await this.lineIdInput.fill(value);
  }

  async fillStep0(data: { fullName: string; age: number; phone: string; lineId?: string }) {
    await this.fillFullName(data.fullName);
    await this.fillAge(data.age);
    await this.fillPhone(data.phone);
    if (data.lineId) await this.fillLineId(data.lineId);
  }

  // ── Step 1 actions ─────────────────────────────────────────────────────
  async selectHomeType(type: 'house' | 'condo' | 'other') {
    const map = {
      house: this.homeTypeHouseButton,
      condo: this.homeTypeCondoButton,
      other: this.homeTypeOtherButton,
    };
    await map[type].click();
  }

  async selectHasPets(option: 'Yes' | 'No') {
    await this.hasPetsSelect.click();
    await this.page.locator('.ant-select-item-option').filter({ hasText: option }).click();
  }

  async fillPetDetails(value: string) {
    await this.petDetailsTextArea.fill(value);
  }

  async fillStep1(data: {
    homeType: 'house' | 'condo' | 'other';
    hasPets: 'Yes' | 'No';
    petDetails?: string;
  }) {
    await this.selectHomeType(data.homeType);
    await this.selectHasPets(data.hasPets);
    if (data.hasPets === 'Yes' && data.petDetails) {
      await this.fillPetDetails(data.petDetails);
    }
  }

  // ── Step 2 actions ─────────────────────────────────────────────────────
  async checkAgree() {
    const isChecked = await this.agreeCheckbox.isChecked();
    if (!isChecked) {
      await this.agreeCheckbox.click();
    }
  }

  // ── Wizard navigation ──────────────────────────────────────────────────
  async goToNextStep() {
    await this.nextButton.click();
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  async submitApplication() {
    await this.submitButton.click();
    await this.successResult.waitFor({ state: 'visible' });
  }

  // ── Error helpers ──────────────────────────────────────────────────────
  getFieldError(fieldLabel: string) {
    return this.page.locator('.form-field')
      .filter({ hasText: fieldLabel })
      .locator('.form-error');
  }
}
