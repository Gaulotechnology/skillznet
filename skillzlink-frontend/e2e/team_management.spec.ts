import { test, expect } from '@playwright/test';

test.describe('Admin Team Members Management & Public About Us Sync', () => {

  test('Admin can manage team members, enforce square photo dimensions, and sync with Meet the Team on /about', async ({ page }) => {
    // 1. Visit /about and verify initial Meet the Team section
    await page.goto('/about');
    await expect(page.locator('h2:has-text("Meet the Team")')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('h3:has-text("Tinashe Moyo")')).toBeVisible();

    // 2. Admin logs in
    await page.goto('/login');
    await page.fill('input[type="tel"]', '+263771111111');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/admin/);

    // 3. Navigate to Team Members management
    await page.goto('/dashboard/admin/team');
    await expect(page.locator('h1:has-text("Meet the Team Management")')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('h3:has-text("Tinashe Moyo")').first()).toBeVisible();

    // 4. Open Add Team Member modal
    await page.click('button:has-text("Add Team Member")');
    await expect(page.locator('h2:has-text("Add New Team Member")')).toBeVisible();

    const timestamp = Date.now();
    const newMemberName = `Dr. Farai Mutasa ${timestamp}`;
    const newMemberRole = `Chief AI Architect ${timestamp}`;
    const newMemberBio = `Leading digital transformation and smart matching algorithms across Zimbabwe. ${timestamp}`;

    await page.fill('input[placeholder*="Tinashe Moyo"]', newMemberName);
    await page.fill('input[placeholder*="Co-Founder & CEO"]', newMemberRole);
    await page.fill('textarea[placeholder*="Short summary"]', newMemberBio);

    // Verify photo requirements helper text is visible
    await expect(page.locator('text=1:1 Aspect Ratio (Square)')).toBeVisible();

    // Submit form
    await page.click('button:has-text("Add Member")');

    // Verify member appears in Admin list
    await expect(page.locator(`h3:has-text("${newMemberName}")`)).toBeVisible({ timeout: 8000 });
    await expect(page.locator(`p:has-text("${newMemberRole}")`)).toBeVisible();

    // 5. Visit public /about page and verify new member appears in "Meet the Team"
    await page.goto('/about');
    await expect(page.locator(`h3:has-text("${newMemberName}")`)).toBeVisible({ timeout: 8000 });
    await expect(page.locator(`span:has-text("${newMemberRole}")`)).toBeVisible();
    await expect(page.locator(`p:has-text("${newMemberBio}")`)).toBeVisible();

    // 6. Return to admin and delete the created member
    await page.goto('/dashboard/admin/team');
    const memberCard = page.locator('div.group', { hasText: newMemberName }).first();
    const deleteBtn = memberCard.locator('button[title="Delete member"]');
    await deleteBtn.click();

    await expect(page.locator('h3:has-text("Remove Team Member?")')).toBeVisible();
    await page.click('button:has-text("Yes, Remove")');

    // Verify member is removed
    await expect(page.locator(`h3:has-text("${newMemberName}")`)).not.toBeVisible({ timeout: 8000 });
  });

});
