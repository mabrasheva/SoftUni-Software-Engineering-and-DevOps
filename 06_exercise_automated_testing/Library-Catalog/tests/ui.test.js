const { test, expect } = require('playwright/test')
const pageUrl = "http://localhost:3000";
const pageLoginUrl = "http://localhost:3000/login";
const pageMyBooksUrl = "http://localhost:3000/profile";
const pageAllBooksUrl = "http://localhost:3000/catalog";
const userEmail = 'peter@abv.bg';
const userPassword = '123456';
const navigationBarSelector = '#site-header > nav';
const allBooksLinkSelector = 'a[href="/catalog"]';
const loginButtonLinkSelector = 'a[href="/login"]';
const registerButtonLinkSelector = 'a[href="/register"]';
const myBooksLinkSelector = 'a[href="/profile"]';
const addBookLinkSelector = 'a[href="/create"]'

// Define the login function
async function login(page, email, password) {
    await page.goto(pageLoginUrl);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('input[type="submit"]');
}

// Navigation Bar for Guest Users

test('Verify "All Books" link is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector(navigationBarSelector);
    const allBooksLink = await page.$(allBooksLinkSelector);
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector(navigationBarSelector);
    const loginButton = await page.$(loginButtonLinkSelector);
    const isLoginButtonVisible = await loginButton.isVisible();
    expect(isLoginButtonVisible).toBe(true);
});

test('Verify "Register" button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector(navigationBarSelector);
    const registerButton = await page.$(registerButtonLinkSelector);
    const isRegisterButtonVisible = await registerButton.isVisible();
    expect(isRegisterButtonVisible).toBe(true);
});

// Navigation Bar for Logged-In Users

test('Verify "All Books" link is visible after user login', async ({ page }) => {
    await login(page, userEmail, userPassword);
    const allBooksLink = await page.$(allBooksLinkSelector);
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify "My Books" link is visible after user login', async ({ page }) => {
    await login(page, userEmail, userPassword);
    const myBooksLink = await page.$(myBooksLinkSelector);
    const isMyBooksLinkVisible = await myBooksLink.isVisible();
    expect(isMyBooksLinkVisible).toBe(true);
});

test('Verify "Add Book" link is visible after user login', async ({ page }) => {
    await login(page, userEmail, userPassword);
    const addBookLink = await page.$(addBookLinkSelector);
    const isAddBookLinkVisible = await addBookLink.isVisible();
    expect(isAddBookLinkVisible).toBe(true);
});

test('Verify user email address is visible after user login', async ({ page }) => {
    await login(page, userEmail, userPassword);
    const spanSelector = '#user > span';
    await page.waitForSelector(spanSelector);
    const isSpanVisible = await page.isVisible(spanSelector);
    expect(isSpanVisible).toBe(true);
    const spanText = await page.textContent(spanSelector);
    expect(spanText).toBe(`Welcome, ${userEmail}`);
});

// Login Page

test('Login with valid credentials', async ({ page }) => {
    await login(page, userEmail, userPassword);
    await page.$(allBooksLinkSelector);
    expect(page.url()).toBe(pageAllBooksUrl);
});

test('Login with empty input fields', async ({ page }) => {
    await login(page, "", "");
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$(loginButtonLinkSelector);
    expect(page.url()).toBe(pageLoginUrl);
});

test.only('Login with empty input fields 2', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        console.log('Actual alert message:', dialog.message());

        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('1234');
        await dialog.accept();
    });

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');
});

test('Login with empty email and valid password input fields', async ({ page }) => {
    await login(page, "", userPassword);
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$(loginButtonLinkSelector);
    expect(page.url()).toBe(pageLoginUrl);
});

test('Login with valid email and empty password input fields', async ({ page }) => {
    await login(page, userEmail, "");
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$(loginButtonLinkSelector);
    expect(page.url()).toBe(pageLoginUrl);
});

// Register Page

