import { test, expect } from '@playwright/test';

test.describe('Professional Dynamic Journey Registration, Dashboard Edit & Public Profile Tests', () => {

  test('1. Helper/Cleaner Journey: Register -> Edit in Dashboard -> Verify Public Profile', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.click('text=I am a professional');

    await page.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Chipo Sibanda');
    const phone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[placeholder="71 234 5678"]', phone);

    // Select Cleaning
    const professionSelect = page.locator('select').filter({ hasText: 'Choose your profession' });
    await professionSelect.selectOption('Cleaning');

    await expect(page.locator('text=Cleaning Trade Questions')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Cleaning Onboarding')).toBeVisible();

    await page.fill('input[placeholder="For identity verification"]', '63-108294M12');
    await page.fill('input[placeholder="e.g. 123 Samora Machel Ave"]', '22 Fife Ave, Harare');
    await page.fill('textarea[placeholder="Tell potential clients about your experience, trade skills and services..."]', 'Reliable domestic housekeeper, child minder and deep cleaning specialist with 5 years experience.');

    await page.locator('select[name="cleaning_specialization"]').selectOption('Domestic Cleaning & Housekeeping');
    await page.locator('select[name="live_in_preference"]').selectOption('Live-out (Daily commuting)');
    await page.locator('input[name="cleaning_experience_years"]').fill('5');
    await page.locator('select[name="cooking_ability"]').selectOption('Comfortable preparing family meals & baking');
    await page.locator('input[name="police_clearance_ready"]').check();
    await page.locator('input[name="childcare_certified"]').check();

    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Verify Your Number')).toBeVisible();

    const otpMsg = await page.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    await page.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await page.click('button:has-text("Verify OTP")');

    await expect(page.locator('text=Create a PIN')).toBeVisible();
    await page.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await page.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    await page.click('button:has-text("Complete Registration")');

    await expect(page.locator('text=You\'re All Set!')).toBeVisible({ timeout: 7000 });
    await page.click('text=Go to Login');

    // 2. Login
    await expect(page).toHaveURL(/.*\/login/);
    await page.fill('input[type="tel"]', phone);
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/provider\/overview/);

    // 3. Edit Profile in Provider Dashboard
    await page.goto('/dashboard/profile');
    await expect(page.locator('text=Cleaning Specific Details')).toBeVisible({ timeout: 7000 });
    await expect(page.locator('text=Cleaning Journey')).toBeVisible();

    // Update experience from 5 to 6 years
    const expInput = page.locator('input[type="number"]');
    await expInput.fill('6');

    await page.click('button:has-text("Save All Updates")');
    await expect(page.locator('text=Profile updated successfully!')).toBeVisible();
  });

  test('2. Plumber Journey: Register -> Edit in Dashboard -> Verify Public Profile', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.click('text=I am a professional');

    await page.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Tendai Gumbo');
    const phone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[placeholder="71 234 5678"]', phone);

    // Select Plumbing
    const professionSelect = page.locator('select').filter({ hasText: 'Choose your profession' });
    await professionSelect.selectOption('Plumbing');

    await expect(page.locator('text=Plumbing Trade Questions')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Plumbing Onboarding')).toBeVisible();

    await page.fill('input[placeholder="For identity verification"]', '08-492019P33');
    await page.fill('input[placeholder="e.g. 123 Samora Machel Ave"]', '104 Jason Moyo Ave, Bulawayo');
    await page.fill('textarea[placeholder="Tell potential clients about your experience, trade skills and services..."]', 'Licensed plumbing contractor specializing in emergency repairs, solar geyser installations, and borehole pumps.');

    await page.locator('select[name="plumbing_specialization"]').selectOption('Geyser Installation & Solar Water Heating');
    await page.locator('input[name="plumbing_experience_years"]').fill('7');
    await page.locator('input[name="plumbing_license_number"]').fill('ZW-PLM-9021');
    await page.locator('select[name="plumbing_tools_transport"]').selectOption('Full toolset + own work vehicle');
    await page.locator('input[name="emergency_callouts_available"]').check();

    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Verify Your Number')).toBeVisible();

    const otpMsg = await page.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    await page.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await page.click('button:has-text("Verify OTP")');

    await expect(page.locator('text=Create a PIN')).toBeVisible();
    await page.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await page.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    await page.click('button:has-text("Complete Registration")');

    await expect(page.locator('text=You\'re All Set!')).toBeVisible({ timeout: 7000 });
    await page.click('text=Go to Login');

    // 2. Login
    await expect(page).toHaveURL(/.*\/login/);
    await page.fill('input[type="tel"]', phone);
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/provider\/overview/);

    // 3. Edit Profile in Provider Dashboard
    await page.goto('/dashboard/profile');
    await expect(page.locator('text=Plumbing Specific Details')).toBeVisible({ timeout: 7000 });
    await expect(page.locator('text=Plumbing Journey')).toBeVisible();

    await page.click('button:has-text("Save All Updates")');
    await expect(page.locator('text=Profile updated successfully!')).toBeVisible();
  });

  test('3. Electrician Journey: Register -> Edit in Dashboard -> Verify Public Profile', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.click('text=I am a professional');

    await page.fill('input[placeholder="e.g. Tinashe Moyo"]', 'Kudakwashe Moyo');
    const phone = `077${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.fill('input[placeholder="71 234 5678"]', phone);

    // Select Electrical
    const professionSelect = page.locator('select').filter({ hasText: 'Choose your profession' });
    await professionSelect.selectOption('Electrical');

    await expect(page.locator('text=Electrical Trade Questions')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Electrical Onboarding')).toBeVisible();

    await page.fill('input[placeholder="For identity verification"]', '44-883019T77');
    await page.fill('input[placeholder="e.g. 123 Samora Machel Ave"]', '55 Churchill Ave, Alexandra Park, Harare');
    await page.fill('textarea[placeholder="Tell potential clients about your experience, trade skills and services..."]', 'Certified electrical technician specializing in commercial 3-phase wiring, solar lithium storage systems and COC compliance.');

    await page.locator('select[name="electrical_specialization"]').selectOption('Solar PV, Lithium Batteries & Inverter Systems');
    await page.locator('input[name="electrical_experience_years"]').fill('9');
    await page.locator('input[name="wiremans_license_number"]').fill('ZERA-ELEC-4421');
    await page.locator('input[name="solar_certified"]').check();
    await page.locator('input[name="coc_certified"]').check();
    await page.locator('input[name="emergency_electric_available"]').check();

    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Verify Your Number')).toBeVisible();

    const otpMsg = await page.locator('.text-green-700.font-mono').textContent();
    const otp = otpMsg?.match(/\d+/)?.[0] || '123456';
    await page.fill('input[placeholder="Enter your 6-digit code"]', otp);
    await page.click('button:has-text("Verify OTP")');

    await expect(page.locator('text=Create a PIN')).toBeVisible();
    await page.fill('input[placeholder="Enter 4-digit PIN"]', '1234');
    await page.fill('input[placeholder="Confirm 4-digit PIN"]', '1234');
    await page.click('button:has-text("Complete Registration")');

    await expect(page.locator('text=You\'re All Set!')).toBeVisible({ timeout: 7000 });
    await page.click('text=Go to Login');

    // 2. Login
    await expect(page).toHaveURL(/.*\/login/);
    await page.fill('input[type="tel"]', phone);
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*\/dashboard\/provider\/overview/);

    // 3. Edit Profile in Provider Dashboard
    await page.goto('/dashboard/profile');
    await expect(page.locator('text=Electrical Specific Details')).toBeVisible({ timeout: 7000 });
    await expect(page.locator('text=Electrical Journey')).toBeVisible();

    await page.click('button:has-text("Save All Updates")');
    await expect(page.locator('text=Profile updated successfully!')).toBeVisible();
  });

  test('4. Seeker Public Profile View: Tailored display for Helper, Plumber, and Electrician', async ({ page }) => {
    // 1. View Helper / Cleaner Profile (ID 105)
    await page.goto('/professional-profile/105');
    await expect(page.locator('text=Verified Cleaning')).toBeVisible({ timeout: 7000 });
    await expect(page.locator('text=Police Clearance Verified')).toBeVisible();
    await expect(page.locator('text=Childcare & First Aid Certified')).toBeVisible();
    await expect(page.locator('text=Domestic Cleaning & Housekeeping')).toBeVisible();
    await expect(page.locator('text=Live-out (Daily commuting)')).toBeVisible();

    // 2. View Plumber Profile (ID 106)
    await page.goto('/professional-profile/106');
    await expect(page.locator('text=Verified Plumbing')).toBeVisible({ timeout: 7000 });
    await expect(page.locator('text=24/7 Emergency Callout Ready')).toBeVisible();
    await expect(page.locator('text=Geyser Installation & Solar Water Heating')).toBeVisible();
    await expect(page.locator('text=ZW-PLM-9021')).toBeVisible();
    await expect(page.locator('text=Full toolset + own work vehicle')).toBeVisible();

    // 3. View Electrician Profile (ID 107)
    await page.goto('/professional-profile/107');
    await expect(page.locator('text=Verified Electrical')).toBeVisible({ timeout: 7000 });
    await expect(page.locator('text=Solar PV & Inverter Certified')).toBeVisible();
    await expect(page.locator('text=COC Compliance Certified')).toBeVisible();
    await expect(page.locator('text=24/7 Emergency Outage Support')).toBeVisible();
    await expect(page.locator('text=Solar PV, Lithium Batteries & Inverter Systems')).toBeVisible();
    await expect(page.locator('text=ZERA-ELEC-4421')).toBeVisible();
  });

});
