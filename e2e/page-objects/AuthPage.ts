import { Page, Locator } from '@playwright/test';

/**
 * Page Object for: Auth (Sign Up / Login)
 * Route: /auth
 * Framework: react / antd
 * Component: src/app/features/auth/Auth.jsx
 */
export class AuthPage {
  readonly page: Page;
  readonly url = '/auth';

  // ── Tabs ──────────────────────────────────────────────────────────────
  readonly signUpTab: Locator;
  readonly loginTab: Locator;

  // ── Form fields ───────────────────────────────────────────────────────
  readonly emailInput: Locator;      // Email — Input
  readonly passwordInput: Locator;   // Password — Input.Password

  // ── Action buttons ────────────────────────────────────────────────────
  readonly createAccountButton: Locator;
  readonly loginButton: Locator;

  // ── Feedback ──────────────────────────────────────────────────────────
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signUpTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Sign Up' });
    this.loginTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Login' });

    // Scoped to active tab pane — both tabs render their forms in the DOM simultaneously
    this.emailInput = page.locator('.ant-tabs-tabpane-active input[placeholder="Email"]');
    this.passwordInput = page.locator('.ant-tabs-tabpane-active input[placeholder="Password"]');

    this.createAccountButton = page.locator('button[type="submit"]').filter({ hasText: 'Create Account' });
    this.loginButton = page.locator('button[type="submit"]').filter({ hasText: 'Login' });

    this.errorBanner = page.locator('.ant-tabs-tabpane-active .form-error-banner');
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async navigate(mode: 'signup' | 'login' = 'signup') {
    await this.page.goto(this.url);
    if (mode === 'login') await this.switchToLogin();
    await this.waitForLoad();
  }

  async waitForLoad() {
    await this.page.waitForSelector('.ant-tabs', { state: 'visible' });
  }

  // ── Tab actions ───────────────────────────────────────────────────────
  async switchToSignUp() {
    await this.signUpTab.click();
    await this.createAccountButton.waitFor({ state: 'visible' });
  }

  async switchToLogin() {
    await this.loginTab.click();
    await this.loginButton.waitFor({ state: 'visible' });
  }

  // ── Form actions ──────────────────────────────────────────────────────
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async signUp(email: string, password: string) {
    await this.switchToSignUp();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.createAccountButton.click();
  }

  async login(email: string, password: string) {
    await this.switchToLogin();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.loginButton.click();
  }

  // ── Assertions helpers ────────────────────────────────────────────────
  async getErrorMessage(): Promise<string> {
    return this.errorBanner.innerText();
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorBanner.isVisible();
  }
}
