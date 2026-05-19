import { Page, Locator } from '@playwright/test';

/**
 * Page Object for: Favorites
 * Route: /favorites
 * Framework: react / antd (Ant Design)
 * Source: src/app/features/favorites/Favorites.jsx
 * Generated: 2026-05-19
 */
export class FavoritesPage {
  readonly page: Page;
  readonly url = '/favorites';

  // ── Page header ────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly favoritesCount: Locator;    // "You have N favorite cats"

  // ── Favorites grid ─────────────────────────────────────────────────────
  readonly productGrid: Locator;
  readonly catCards: Locator;          // all .cat-card elements in the grid — dynamic list

  // ── Empty state ────────────────────────────────────────────────────────
  readonly emptyState: Locator;        // antd Empty — shown when favorites list is empty

  constructor(page: Page) {
    this.page = page;

    this.pageTitle      = page.locator('h2.page-title');
    this.favoritesCount = page.locator('p.mb-4');

    this.productGrid = page.locator('.product-grid');
    this.catCards    = page.locator('.product-grid .ant-card');

    this.emptyState = page.locator('.ant-empty');
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  async navigate() {
    await this.page.goto(this.url);
    await this.waitForLoad();
  }

  async waitForLoad() {
    await this.page.waitForSelector('h2.page-title', { state: 'visible' });
  }

  // ── State helpers ──────────────────────────────────────────────────────
  async getFavoritesCount(): Promise<number> {
    const text = await this.favoritesCount.innerText();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  // ── Card helpers (dynamic list) ────────────────────────────────────────
  getCatCard(catName: string): Locator {
    return this.productGrid.locator('.ant-card').filter({ hasText: catName });
  }

  getCatCardByIndex(index: number): Locator {
    return this.catCards.nth(index);
  }

  // ── Actions ────────────────────────────────────────────────────────────
  async removeFavorite(catName: string) {
    const card = this.getCatCard(catName);
    await card.locator('button.ant-btn-dangerous').click();
  }

  async viewDetails(catName: string) {
    const card = this.getCatCard(catName);
    await card.locator('button').filter({ hasText: 'Details' }).click();
  }

  async adoptCat(catName: string) {
    const card = this.getCatCard(catName);
    await card.locator('button').filter({ hasText: 'Adopt' }).click();
  }

  async toggleFavorite(catName: string) {
    const card = this.getCatCard(catName);
    await card.locator('.favorite-btn').click();
  }
}
