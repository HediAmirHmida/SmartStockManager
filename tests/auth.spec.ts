import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  test('invalid login shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrong-password');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText(/login failed|invalid|error/i)).toBeVisible();
  });
});


