import { test, expect } from '@playwright/test';

test.describe('Admin Insights & Analytics Graphs and API Logs', () => {

  test('Admin Insights Page renders all interactive graphs, KPI cards, and breakdowns', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Log in as Admin
    await page.goto('/login');
    await page.fill('input[type="tel"]', '+263771111111');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/admin/);

    // 2. Navigate to Admin Insights
    await page.goto('/dashboard/admin/insights');
    await expect(page.locator('h1:has-text("Platform Insights & Analytics")')).toBeVisible({ timeout: 7000 });

    // 3. Verify KPI Metric Cards
    await expect(page.locator('text=Gross Platform Revenue')).toBeVisible();
    await expect(page.locator('text=Total Bookings & Dispatches')).toBeVisible();
    await expect(page.locator('text=Active Users on Network')).toBeVisible();
    await expect(page.locator('text=Service Completion Rate')).toBeVisible();
    await expect(page.locator('text=Avg. On-Demand Match Speed')).toBeVisible();
    await expect(page.locator('text=Customer Satisfaction')).toBeVisible();

    // 4. Verify Financial & Booking Velocity Area Graph
    await expect(page.locator('text=Financial & Booking Velocity Trend')).toBeVisible();
    await expect(page.locator('.recharts-responsive-container').first()).toBeVisible();

    // Test metric filter buttons
    await page.click('button:has-text("Revenue ($)")');
    await page.click('button:has-text("Bookings")');
    await page.click('button:has-text("All Metrics")');

    // 5. Verify Trade Category Share Donut / Pie Chart
    await expect(page.locator('text=Trade Category Share & Volume')).toBeVisible();
    await expect(page.locator('text=Plumbing').first()).toBeVisible();
    await expect(page.locator('text=Cleaning').first()).toBeVisible();
    await expect(page.locator('text=Electrical').first()).toBeVisible();

    // 6. Verify User Acquisition & Onboarding Bar Chart
    await expect(page.locator('text=User Acquisition & Onboarding')).toBeVisible();
    await expect(page.locator('text=Seekers (Clients)')).toBeVisible();
    await expect(page.locator('text=Artisans (Providers)')).toBeVisible();

    // 7. Verify On-Demand Radar & Dispatch Trends Line Chart
    await expect(page.locator('text=On-Demand Radar & Dispatch Trends')).toBeVisible();
    await expect(page.locator('text=Instant Radar Dispatches')).toBeVisible();

    // 8. Verify Top Earning Artisans Leaderboard
    await expect(page.locator('text=Top Earning Artisans')).toBeVisible();

    // 9. Verify Time Filter Period Switching
    await page.click('button:has-text("7 Days")');
    await expect(page.locator('text=Financial & Booking Velocity Trend')).toBeVisible();
    await page.click('button:has-text("30 Days")');

    await context.close();
  });

  test('Admin API Logs Page renders real-time API logs, method badges, and status codes', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Log in as Admin
    await page.goto('/login');
    await page.fill('input[type="tel"]', '+263771111111');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/admin/);

    // 2. Navigate to Admin API Logs
    await page.goto('/dashboard/admin/api-logs');
    await expect(page.locator('h2:has-text("API Health & Logs")')).toBeVisible({ timeout: 7000 });

    // 3. Verify Log Entries Table is populated
    await expect(page.locator('text=Total Requests')).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
    await expect(page.locator('span:has-text("200")').first()).toBeVisible({ timeout: 5000 });

    // 4. Test Filter by Method
    await page.selectOption('select', 'GET');
    await expect(page.locator('table').first()).toBeVisible();

    await context.close();
  });

});
