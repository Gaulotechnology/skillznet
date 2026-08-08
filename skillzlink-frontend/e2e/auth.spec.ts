import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {

  test('Seeker Registration Flow', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');
    
    // Select Seeker role
    await page.click('text=I want to hire');
    await page.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Test Seeker');
    
    // Generate random phone number to avoid collisions
    const randomPhone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[type="tel"]', randomPhone);
    
    // Submit Details
    await page.click('button:has-text("Continue")');
    
    // Wait for OTP step
    await page.waitForSelector('text=Verify Your Number');
    
    // The OTP is returned in the UI as a "Dev OTP: XXXXXX" message for local testing
    const otpMsg = await page.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    
    await page.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await page.click('button:has-text("Verify OTP")');
    
    // Wait for PIN step
    await page.waitForSelector('text=Create a PIN');
    
    // Fill PINs
    await page.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await page.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    
    await page.click('button:has-text("Complete Registration")');
    
    // Verify success page is shown
    await page.waitForSelector('text=You\'re All Set!');
    await page.click('text=Go to Login');
    
    // Should now be on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Attempt Login
    await page.fill('input[type="tel"]', randomPhone);
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');
    
    // Should be redirected to Seeker Dashboard
    await expect(page).toHaveURL(/.*\/dashboard\/seeker\/overview/);
  });

  test('Provider Registration Flow', async ({ page }) => {
    await page.goto('/register');
    
    // Select Provider role
    await page.click('text=I am a professional');
    
    await page.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Test Provider');
    
    const randomPhone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[type="tel"]', randomPhone);
    
    await page.fill('input[placeholder="For verification purposes"]', '12-345678-A-90');
    
    // The second select on the page is Category
    await page.locator('select').nth(1).selectOption('Plumbing');
    
    await page.fill('input[placeholder="e.g. 123 Samora Machel Ave"]', 'Test Address');
    await page.fill('textarea', 'I am a test provider.');
    
    await page.click('button:has-text("Continue")');
    
    // Wait for OTP step
    await page.waitForSelector('text=Verify Your Number');
    
    const otpMsg = await page.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    
    await page.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await page.click('button:has-text("Verify OTP")');
    
    // Wait for PIN step
    await page.waitForSelector('text=Create a PIN');
    
    await page.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await page.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    
    await page.click('button:has-text("Complete Registration")');
    
    // Verify success page is shown
    await page.waitForSelector('text=You\'re All Set!');
    await page.click('text=Go to Login');
    
    // Should now be on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Attempt Login
    await page.fill('input[type="tel"]', randomPhone);
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');
    
    // Should be redirected to Provider Dashboard
    await expect(page).toHaveURL(/.*\/dashboard\/provider\/overview/);
  });
});
