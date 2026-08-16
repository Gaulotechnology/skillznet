import { test, expect } from '@playwright/test';

test.describe('Uber-Style On-Demand Matching Workflow', () => {

  test('Complete End-to-End On-Demand Matching Flow: Seeker Post -> Provider Claim -> Contact Handover -> Admin Monitor', async ({ browser }) => {
    // We will use 2 separate browser contexts:
    // Context 1: Seeker
    // Context 2: Plumber Provider
    const seekerContext = await browser.newContext();
    const providerContext = await browser.newContext();
    const adminContext = await browser.newContext();

    const seekerPage = await seekerContext.newPage();
    const providerPage = await providerContext.newPage();
    const adminPage = await adminContext.newPage();

    // ─── STEP 1: Seeker Registers & Navigates to Request Form ───
    await seekerPage.goto('/register');
    await seekerPage.click('text=I want to hire');
    await seekerPage.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Tariro Chikore');

    const seekerPhone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await seekerPage.fill('input[type="tel"]', seekerPhone);
    await seekerPage.click('button:has-text("Continue")');

    await expect(seekerPage.locator('text=Verify Your Number')).toBeVisible();
    const otpMsg = await seekerPage.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    await seekerPage.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await seekerPage.click('button:has-text("Verify OTP")');

    await expect(seekerPage.locator('text=Create a PIN')).toBeVisible();
    await seekerPage.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await seekerPage.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    await seekerPage.click('button:has-text("Complete Registration")');

    await expect(seekerPage.locator('text=You\'re All Set!')).toBeVisible({ timeout: 7000 });
    await seekerPage.click('text=Go to Login');

    await expect(seekerPage).toHaveURL(/.*\/login/);
    await seekerPage.fill('input[type="tel"]', seekerPhone);
    await seekerPage.fill('input[type="password"]', '1234');
    await seekerPage.click('button:has-text("Sign In")');

    await expect(seekerPage).toHaveURL(/.*\/dashboard\/seeker\/overview/);

    // ─── STEP 2: Seeker Dispatches Instant On-Demand Request (Uber Style) ───
    await seekerPage.goto('/dashboard/seeker/requests/new');
    await expect(seekerPage.locator('text=Instant On-Demand Match (Uber Style)')).toBeVisible();

    const uniqueJobTitle = `Emergency Pipe Repair ${Date.now()}`;

    // Fill On-Demand Form
    await seekerPage.locator('select').nth(0).selectOption('Plumbing');
    await seekerPage.locator('select').nth(1).selectOption('Harare');
    await seekerPage.fill('input[placeholder*="burst pipe"]', uniqueJobTitle);
    await seekerPage.fill('input[placeholder*="Samora Machel"]', '18 King George Rd, Avondale, Harare');
    await seekerPage.fill('textarea[placeholder*="Describe the issue"]', 'Main pipe burst under the sink, flooding the kitchen. Need emergency plumber ASAP.');
    await seekerPage.fill('input[placeholder="e.g. 35"]', '45');

    // Click Broadcast
    await seekerPage.click('button:has-text("Find Professional Now")');

    // Verify Live Radar Screen Appears
    await expect(seekerPage.locator('text=Radar Broadcasting Live')).toBeVisible({ timeout: 6000 });
    await expect(seekerPage.locator('text=Looking for Available Plumbing Professionals...')).toBeVisible();
    await expect(seekerPage.locator('text=18 King George Rd, Avondale, Harare')).toBeVisible();

    // ─── STEP 3: Plumber Logs in & Claims Job Offer ───
    await providerPage.goto('/login');
    await providerPage.fill('input[type="tel"]', '+263774000102');
    await providerPage.fill('input[type="password"]', '1357');
    await providerPage.click('button:has-text("Sign In")');

    await expect(providerPage).toHaveURL(/.*\/dashboard\/provider\/overview/);

    // Navigate to Quotes / Job Radar
    await providerPage.goto('/dashboard/provider/quotes');
    await expect(providerPage.locator('text=Live On-Demand Job Offers')).toBeVisible({ timeout: 6000 });
    await expect(providerPage.locator(`text=${uniqueJobTitle}`)).toBeVisible({ timeout: 7000 });

    // Plumber Clicks "Accept Job Now"
    await providerPage.click('button:has-text("Accept Job Now")');
    await expect(providerPage.locator('text=Job successfully accepted!')).toBeVisible({ timeout: 6000 });

    // Verify Plumber sees Client Contact Card
    await expect(providerPage.locator('text=My Claimed Jobs')).toBeVisible();
    await expect(providerPage.locator('text=Tariro Chikore').first()).toBeVisible();
    await expect(providerPage.locator('a:has-text("Call Client")').first()).toBeVisible();
    await expect(providerPage.locator('a:has-text("WhatsApp")').first()).toBeVisible();

    // ─── STEP 4: Seeker Screen Automatically Transitions to Match Celebration ───
    await expect(seekerPage.locator('text=Match Confirmed!')).toBeVisible({ timeout: 10000 });
    await expect(seekerPage.locator('text=Tendai Gumbo').first()).toBeVisible();
    await expect(seekerPage.locator('a:has-text("Call Now")').first()).toBeVisible();
    await expect(seekerPage.locator('a:has-text("WhatsApp")').first()).toBeVisible();

    // ─── STEP 5: Admin Matching Console Monitor ───
    await adminPage.goto('/login');
    await adminPage.fill('input[type="tel"]', '+263771111111');
    await adminPage.fill('input[type="password"]', '1234');
    await adminPage.click('button:has-text("Sign In")');
    await expect(adminPage).toHaveURL(/.*\/dashboard\/admin/);

    await adminPage.goto('/dashboard/admin/matching');
    await expect(adminPage.locator('h1:has-text("On-Demand Matching")')).toBeVisible({ timeout: 7000 });
    await expect(adminPage.locator(`text=${uniqueJobTitle}`)).toBeVisible();
    await expect(adminPage.locator('text=Tendai Gumbo').first()).toBeVisible();
    await expect(adminPage.locator('text=Tariro Chikore').first()).toBeVisible();
    await expect(adminPage.locator('span:has-text("matched")').first()).toBeVisible();

    // Clean up
    await seekerContext.close();
    await providerContext.close();
    await adminContext.close();
  });

});
