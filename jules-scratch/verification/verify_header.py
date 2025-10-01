from playwright.sync_api import sync_playwright, Page, expect

def verify_header(page: Page):
    """
    This script verifies that the header component renders correctly.
    """
    # 1. Navigate to the application's home page.
    page.goto("http://localhost:3000")

    # 2. Wait for the header element to be visible.
    header = page.locator("header")
    expect(header).to_be_visible()

    # 3. Take a screenshot of the header.
    header.screenshot(path="jules-scratch/verification/header_verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_header(page)
        browser.close()

if __name__ == "__main__":
    main()