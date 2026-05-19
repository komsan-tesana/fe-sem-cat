import { test, expect } from '@playwright/test';
import { AuthPage } from '../page-objects';

const SUCCESS_REGISTER = { token: 'fake-token' };
const SUCCESS_LOGIN = { token: 'fake-token', user: { role: 'user' } };
const ERROR_INVALID_CREDENTIALS = { message: 'Invalid credentials' };

test.describe('Auth page', () => {
  test('shows Sign Up tab as active by default', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigate();
    await expect(auth.signUpTab).toHaveClass(/ant-tabs-tab-active/);
    await expect(auth.createAccountButton).toBeVisible();
  });

  test('Sign Up > success redirects to home', async ({ page }) => {
    await page.route('**/auth/register', (route) =>
      route.fulfill({ status: 200, json: SUCCESS_REGISTER })
    );
    const auth = new AuthPage(page);
    await auth.navigate('signup');
    await auth.signUp('test@example.com', 'password123');
    await expect(page).toHaveURL('/');
  });

  test('Sign Up > empty email shows validation message', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigate('signup');
    await auth.createAccountButton.click();
    await expect(page.locator('.ant-form-item-explain-error').first()).toBeVisible();
  });

  test('Sign Up > short password shows validation message', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigate('signup');
    await auth.fillEmail('test@example.com');
    await auth.fillPassword('abc');
    await auth.createAccountButton.click();
    await expect(page.locator('.ant-form-item-explain-error')).toContainText(
      'Password must be at least 6 characters'
    );
  });

  test('Login > success redirects to home', async ({ page }) => {
    await page.route('**/auth/login', (route) =>
      route.fulfill({ status: 200, json: SUCCESS_LOGIN })
    );
    const auth = new AuthPage(page);
    await auth.navigate('login');
    await auth.login('test@example.com', 'password123');
    await expect(page).toHaveURL('/');
  });

  test('Login > invalid credentials shows error banner', async ({ page }) => {
    await page.route('**/auth/login', (route) =>
      route.fulfill({ status: 401, json: ERROR_INVALID_CREDENTIALS })
    );
    const auth = new AuthPage(page);
    await auth.navigate('login');
    await auth.login('wrong@example.com', 'wrongpass');
    await expect(auth.errorBanner).toBeVisible();
    await expect(auth.errorBanner).toContainText('Invalid credentials');
  });

  test('switching tabs clears form fields', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigate('signup');
    await auth.fillEmail('test@example.com');
    await auth.fillPassword('mypassword');
    await auth.switchToLogin();
    await expect(auth.emailInput).toHaveValue('');
    await expect(auth.passwordInput).toHaveValue('');
  });

  test('switching tabs clears error banner', async ({ page }) => {
    await page.route('**/auth/login', (route) =>
      route.fulfill({ status: 401, json: ERROR_INVALID_CREDENTIALS })
    );
    const auth = new AuthPage(page);
    await auth.navigate('login');
    await auth.login('wrong@example.com', 'wrongpass');
    await expect(auth.errorBanner).toBeVisible();
    await auth.switchToSignUp();
    await expect(auth.errorBanner).not.toBeVisible();
  });
});
