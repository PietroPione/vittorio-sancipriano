from playwright.sync_api import Page, expect
import time

def verify_page_load(page: Page):
    """
    This script verifies that the homepage loads without crashing and takes a screenshot.
    """
    # 1. Navigate to the homepage.
    page.goto("http://localhost:3000", timeout=60000)

    # 2. Wait for the main navigation to be visible to ensure the page has loaded.
    nav_element = page.locator("nav").first
    expect(nav_element).to_be_visible(timeout=20000)

    # 3. Take a screenshot for visual confirmation.
    page.screenshot(path="jules-scratch/verification/verification.png")