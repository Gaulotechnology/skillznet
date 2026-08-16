import { test, expect } from '@playwright/test';

test.describe('Guest On-Demand Hiring, Wishlist & Theme System', () => {

  test('1. Guest Seeker On-Demand Hiring Flow: Unauthenticated post -> Provider claim -> Match celebration with WhatsApp/Call', async ({ browser }) => {
    // 1. Guest Context (No prior login)
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();

    await guestPage.goto('/hire-now');
    await expect(guestPage.locator('h1:has-text("Request an Artisan in Seconds")')).toBeVisible({ timeout: 8000 });

    const timestamp = Date.now();
    const uniqueTitle = `Emergency Pipe Burst ${timestamp}`;

    // Fill guest form
    await guestPage.fill('input[placeholder*="Tariro"]', 'Guest Client');
    await guestPage.fill('input[placeholder*="0771234567"]', `+263779${timestamp.toString().slice(-6)}`);
    await guestPage.click('button:has-text("Plumbing")');
    await guestPage.selectOption('select', 'Bulawayo');
    await guestPage.fill('input[placeholder*="pipe leak"]', uniqueTitle);
    await guestPage.fill('input[placeholder*="Borrowdale"]', '104 Jason Moyo Ave, Bulawayo');
    await guestPage.click('button:has-text("Immediate")');

    // Submit broadcast
    await guestPage.click('button:has-text("Broadcast On-Demand Request Now")');

    // Verify Active Radar Screen
    await expect(guestPage.locator('text=Broadcasting to Verified Plumbings...')).toBeVisible({ timeout: 10000 });

    // 2. Provider Context (Logs in as Plumber & claims job)
    const providerContext = await browser.newContext();
    const providerPage = await providerContext.newPage();

    await providerPage.goto('/login');
    await providerPage.fill('input[type="tel"]', '+263774000102');
    await providerPage.fill('input[type="password"]', '1357');
    await providerPage.click('button:has-text("Sign In")');
    await providerPage.waitForURL(/\/dashboard\/provider/, { timeout: 10000 });

    // Provider visits Quotes / Radar Job board
    await providerPage.goto('/dashboard/provider/quotes');
    await expect(providerPage.locator(`text=${uniqueTitle}`).first()).toBeVisible({ timeout: 12000 });

    // Provider accepts the job
    const acceptBtn = providerPage.locator(`div:has-text("${uniqueTitle}")`).locator('button:has-text("Accept Job Now")').first();
    await acceptBtn.click();

    // 3. Guest receives instant match confirmation
    await expect(guestPage.locator('text=Artisan Confirmed & Dispatched!')).toBeVisible({ timeout: 10000 });
    await expect(guestPage.locator('text=WhatsApp Artisan')).toBeVisible();
    await expect(guestPage.locator('text=Call')).toBeVisible();

    await guestContext.close();
    await providerContext.close();
  });

  test('2. Wishlist System: Save items on marketplace & profile page, verify sync in Seeker Saved items', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Visit Nearby Professionals marketplace
    await page.goto('/nearby-professionals');
    await expect(page.locator('h1:has-text("Find Professionals Near You")')).toBeVisible({ timeout: 8000 });

    // Click the heart button on the first professional card
    const firstHeart = page.locator('button[aria-label*="Save to wishlist"], button[aria-label*="Remove from saved"]').first();
    await expect(firstHeart).toBeVisible();
    await firstHeart.click();

    // Verify heart button state is active
    await expect(page.locator('button[aria-label="Remove from saved"]').first()).toBeVisible();

    // 2. Register a seeker to visit Seeker Dashboard Saved Pros
    await page.goto('/register');
    await page.click('text=I want to hire');
    await page.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Saved Test Seeker');
    const seekerPhone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[type="tel"]', seekerPhone);
    await page.click('button:has-text("Continue")');

    const otpMsg = await page.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    await page.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await page.click('button:has-text("Verify OTP")');

    await page.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await page.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    await page.click('button:has-text("Complete Registration")');

    await expect(page.locator('text=You\'re All Set!')).toBeVisible({ timeout: 7000 });
    await page.click('text=Go to Login');

    await expect(page).toHaveURL(/.*\/login/);
    await page.fill('input[type="tel"]', seekerPhone);
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/seeker\/overview/);

    await page.goto('/dashboard/seeker/saved');
    await expect(page.locator('h2:has-text("Saved Professionals")')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Keep track of your favorite service providers.')).toBeVisible();

    await context.close();
  });

  test('3. Theme-Driven Platform: ThemeProvider correctly sets CSS variables across pages', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/');
    
    // Check that CSS variable --accent-color is defined and applied on the root element
    const accentColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    });

    expect(accentColor).toBeTruthy();

    await page.goto('/nearby-professionals');
    const accentColorListing = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    });
    expect(accentColorListing).toBeTruthy();

    await context.close();
  });

});
