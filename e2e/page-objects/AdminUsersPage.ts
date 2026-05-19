import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object for: Admin Users Management
 * Route: /admin/users
 * Framework: react / antd v6
 * Source: src/app/features/admin/users/AdminUsers.jsx
 * Generated: 2026-05-19
 */
export class AdminUsersPage {
  readonly page: Page;
  readonly url = '/admin/users';

  // ── Search ────────────────────────────────────────────────────────────
  readonly searchInput: Locator;       // Search by email or name

  // ── Table ─────────────────────────────────────────────────────────────
  readonly usersTable: Locator;

  // ── Edit modal ────────────────────────────────────────────────────────
  readonly editModal: Locator;
  readonly nameInput: Locator;         // Name — Input (inside edit modal)
  readonly roleSelect: Locator;        // Role — Select (inside edit modal)
  readonly saveButton: Locator;        // Save — submit button

  // ── Delete confirm modal ──────────────────────────────────────────────
  readonly deleteConfirmModal: Locator;
  readonly deleteConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.locator('input[placeholder="Search by email or name"]');
    this.usersTable = page.locator('.ant-table');

    this.editModal = page.locator('.ant-modal-content').filter({ hasText: 'Edit User' });
    this.nameInput = this.editModal.locator('input#name, input[id*="name"]');
    this.roleSelect = this.editModal.locator('.ant-select').filter({ hasText: /user|admin/i }).first();
    this.saveButton = this.editModal.locator('button[type="submit"]').filter({ hasText: 'Save' });

    this.deleteConfirmModal = page.locator('.ant-modal-confirm');
    this.deleteConfirmButton = page.locator('.ant-modal-confirm .ant-btn-dangerous').filter({ hasText: 'Delete' });
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForLoad();
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForSelector('.ant-table', { state: 'visible' });
  }

  // ── Search ────────────────────────────────────────────────────────────
  async search(text: string): Promise<void> {
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(300); // debounce filter
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  // ── Table row helpers ─────────────────────────────────────────────────
  getRow(email: string): Locator {
    return this.usersTable.locator('tr').filter({ hasText: email });
  }

  getEditButton(email: string): Locator {
    return this.getRow(email).locator('button').filter({ hasText: 'Edit' });
  }

  getDeleteButton(email: string): Locator {
    return this.getRow(email).locator('button').filter({ hasText: 'Delete' });
  }

  // ── Edit modal actions ────────────────────────────────────────────────
  async openEditModal(email: string): Promise<void> {
    await this.getEditButton(email).click();
    await this.editModal.waitFor({ state: 'visible' });
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.fill(name);
  }

  async selectRole(role: 'user' | 'admin'): Promise<void> {
    await this.roleSelect.click();
    await this.page.locator('.ant-select-item-option').filter({ hasText: role }).click();
  }

  async submitEdit(): Promise<void> {
    await this.saveButton.click();
    await this.editModal.waitFor({ state: 'hidden' });
  }

  async editUser(email: string, updates: { name?: string; role?: 'user' | 'admin' }): Promise<void> {
    await this.openEditModal(email);
    if (updates.name !== undefined) await this.fillName(updates.name);
    if (updates.role !== undefined) await this.selectRole(updates.role);
    await this.submitEdit();
  }

  // ── Delete actions ────────────────────────────────────────────────────
  async deleteUser(email: string): Promise<void> {
    await this.getDeleteButton(email).click();
    await this.deleteConfirmModal.waitFor({ state: 'visible' });
    await this.deleteConfirmButton.click();
    await this.deleteConfirmModal.waitFor({ state: 'hidden' });
  }

  // ── Assertions helpers ────────────────────────────────────────────────
  async getRowCount(): Promise<number> {
    return this.usersTable.locator('tbody tr.ant-table-row').count();
  }

  async isUserVisible(email: string): Promise<boolean> {
    return this.getRow(email).isVisible();
  }
}
