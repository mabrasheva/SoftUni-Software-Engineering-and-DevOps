const { test, expect } = require('playwright/test')
const pageUrl = "http://localhost:3000";
const pageLoginUrl = "http://localhost:3000/login";
const pageMyBooksUrl = "http://localhost:3000/profile";
const pageAllBooksUrl = "http://localhost:3000/catalog";
const pageRegisterUrl = "http://localhost:3000/register";
const pageAddBookUrl = "http://localhost:3000/create";
function generateRandomNumber() {
    return Math.floor(Math.random() * 1000) + 1;
}
const userEmail = 'peter@abv.bg';
const userPassword = '123456';
const userEmailRegister = `peter${generateRandomNumber()}@abv.bg`;
const userPasswordRegister = '5AxvIHuS7jggFRGjQi3i!';
const bookTitle = `Test Book ${generateRandomNumber()}`
const bookDescription = 'This is a test book description'
const bookImage = 'https://example.com/book-image.jpg'
const bookType = 'Romance'
const navigationBarSelector = '#site-header > nav';
const allBooksLinkSelector = 'a[href="/catalog"]';
const loginButtonLinkSelector = 'a[href="/login"]';
const logoutButtonLinkSelector = 'a[id="logoutBtn"]';
const registerButtonLinkSelector = 'a[href="/register"]';
const myBooksLinkSelector = 'a[href="/profile"]';
const addBookLinkSelector = 'a[href="/create"]'
const addBookFormSelector = "#create-form"
const allBooksListSelector = "#dashboard-page"

// Define the login function
async function login(page, email, password) {
    await page.goto(pageLoginUrl);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('input[type="submit"]');
}

// Define the register function
async function register(page, email, password, confirmPass) {
    await page.goto(pageRegisterUrl);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirm-pass"]', confirmPass);
    await page.click('input[type="submit"]');
}

// Define the fill add book form function
async function fillAddBookForm(page, title, description, image, type) {
    await page.fill('#title', title);
    await page.fill('#description', description);
    await page.fill('#image', image);
    await page.selectOption('#type', type);
    await page.click('#create-form > fieldset > input')
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
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await login(page, "", "");
    await page.$(loginButtonLinkSelector);
    expect(page.url()).toBe(pageLoginUrl);
});

test('Login with empty email and valid password input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await login(page, "", userPassword);
    await page.$(loginButtonLinkSelector);
    expect(page.url()).toBe(pageLoginUrl);
});

test('Login with valid email and empty password input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await login(page, userEmail, "");
    await page.$(loginButtonLinkSelector);
    expect(page.url()).toBe(pageLoginUrl);
});

// Register Page

test('Rgister with valid values', async ({ page }) => {
    await register(page, userEmailRegister, userPasswordRegister, userPasswordRegister)
    await page.$(allBooksLinkSelector);
    expect(page.url()).toBe(pageAllBooksUrl);
});

test('Register with empty input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.goto(pageRegisterUrl);
    await page.click('input[type="submit"]');
    await page.$(registerButtonLinkSelector);
    expect(page.url()).toBe(pageRegisterUrl);
});

test('Register with empty email and valid password and valid confirm password input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await register(page, "", userPasswordRegister, userPasswordRegister)
    await page.$(registerButtonLinkSelector);
    expect(page.url()).toBe(pageRegisterUrl);
});

test('Register with valid email and empty password and valid confirm password input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await register(page, userEmailRegister, "", userPasswordRegister)
    await page.$(registerButtonLinkSelector);
    expect(page.url()).toBe(pageRegisterUrl);
});

test('Register with valid email and valid password and empty confirm password input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await register(page, userEmailRegister, userPasswordRegister, "")
    await page.$(registerButtonLinkSelector);
    expect(page.url()).toBe(pageRegisterUrl);
});

test('Register with valid email and different passwords input fields', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('Passwords don\'t match!');
        await dialog.accept();
    });
    await register(page, userEmailRegister, userPasswordRegister, `${userPasswordRegister}123`)
    await page.$(registerButtonLinkSelector);
    expect(page.url()).toBe(pageRegisterUrl);
});

// "Add Book" Page

test('Add book with valid data', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(addBookLinkSelector);
    await page.waitForSelector(addBookFormSelector);
    await fillAddBookForm(page, bookTitle, bookDescription, bookImage, bookType);
    await page.waitForURL(pageAllBooksUrl);
    expect(page.url()).toBe(pageAllBooksUrl);
});

test('Add book with empty title field', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(addBookLinkSelector);
    await page.waitForSelector(addBookFormSelector);
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await fillAddBookForm(page, "", bookDescription, bookImage, bookType);
    await page.$(addBookLinkSelector);
    expect(page.url()).toBe(pageAddBookUrl);
});

test('Add book with empty description field', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(addBookLinkSelector);
    await page.waitForSelector(addBookFormSelector);
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await fillAddBookForm(page, bookTitle, "", bookImage, bookType);
    await page.$(addBookLinkSelector);
    expect(page.url()).toBe(pageAddBookUrl);
});

test('Add book with empty URL image field', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(addBookLinkSelector);
    await page.waitForSelector(addBookFormSelector);
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await fillAddBookForm(page, bookTitle, bookDescription, "", bookType);
    await page.$(addBookLinkSelector);
    expect(page.url()).toBe(pageAddBookUrl);
});

// "All Books" Page

test('Login and verify all books are displayed', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.waitForSelector(allBooksListSelector);
    const bookElements = await page.$$('.other-books-list li');
    expect(bookElements.length).toBeGreaterThan(0);
});

// Uncomment the test if no books in the database.
/*
test.only('Verify no books are displayed', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.waitForSelector(allBooksListSelector);
    const noBooksMessage = await page.textContent('.no-books');
    expect(noBooksMessage).toBe('No books in database!');
});
*/

// "Details" Page

test('Login and verify Details button works', async ({ page }) => {
    await Promise.all([
        login(page, userEmail, userPassword),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');
    const detailsBookTitle = await page.textContent('.book-information h3');
    expect(detailsBookTitle).toContain('Test Book');
});

test('Verify Details button works for guest', async ({ page }) => {
    await page.goto(pageAllBooksUrl);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');
    const detailsBookTitle = await page.textContent('.book-information h3');
    expect(detailsBookTitle).toContain('Test Book');
});

test('Verify Details page display all book information', async ({ page }) => {
    await page.goto(pageAllBooksUrl);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');
    const detailsBookTitle = await page.textContent('.book-information h3');
    const detailsBooktype = await page.textContent('.type');
    const detailsBookImage = await page.textContent('.img');
    expect(detailsBookTitle).toContain('Test Book');
    expect(detailsBooktype).toContain(bookType);
    expect(detailsBookImage).not.toBeNull;
});

test('Verify if edit and delete buttons are visible for creator', async ({ page }) => {
    await Promise.all([
        login(page, 'peter@abv.bg', '123456'),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const editButtonSelector = '.actions a.button:has-text("Edit")'
    const editButton = await page.$(editButtonSelector);
    const isEditButtonVisible = await editButton.isVisible();
    expect(isEditButtonVisible).toBe(true);

    const deleteButtonSelector = '.actions a.button:has-text("Delete")'
    const deleteButton = await page.$(deleteButtonSelector);
    const isDeleteButtonVisible = await deleteButton.isVisible();
    expect(isDeleteButtonVisible).toBe(true);
});


test('Verify if edit and delete buttons are not visible for non-creator', async ({ page }) => {
    await Promise.all([
        login(page, 'john@abv.bg', '123456'),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const editButtonSelector = '.actions a.button:has-text("Edit")'
    const editButton = await page.$(editButtonSelector);
    const isEditButtonNotVisible = editButton === null;
    expect(isEditButtonNotVisible).toBe(true);

    const deleteButtonSelector = '.actions a.button:has-text("Delete")'
    const deleteButton = await page.$(deleteButtonSelector);
    const isDeleteButtonNotVisible = deleteButton === null;
    expect(isDeleteButtonNotVisible).toBe(true);
});

test('Verify if like button is not visible for creator', async ({ page }) => {
    await Promise.all([
        login(page, 'peter@abv.bg', '123456'),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const editButtonSelector = '.actions a.button:has-text("Like")'
    const editButton = await page.$(editButtonSelector);
    const isEditButtonNotVisible = editButton === null;
    expect(isEditButtonNotVisible).toBe(true);
});

test('Verify if like button is visible for non-creator', async ({ page }) => {
    await Promise.all([
        login(page, 'john@abv.bg', '123456'),
        page.waitForURL(pageAllBooksUrl)
    ]);
    await page.click(allBooksLinkSelector);
    await page.waitForSelector('.otherBooks');
    await page.click('.otherBooks a.button');
    await page.waitForSelector('.book-information');

    const editButtonSelector = '.actions a.button:has-text("Like")'
    const editButton = await page.$(editButtonSelector);
    const isEditButtonVisible = await editButton.isVisible();
    expect(isEditButtonVisible).toBe(true);
});

// "Logout" Functionality

test('Verify logout button is visible', async ({ page }) => {
    await login(page, userEmail, userPassword);
    const logoutButton = await page.$(logoutButtonLinkSelector);
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);
});

test('Verify logout button redirects correctly', async ({ page }) => {
    await login(page, userEmail, userPassword);
    const logoutButton = await page.$(logoutButtonLinkSelector);
    await logoutButton.click();
    const redirecedtUrl = page.url();
    expect(redirecedtUrl).toBe(pageAllBooksUrl);
});
