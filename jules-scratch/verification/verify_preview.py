from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # 1. Go to the homepage
            page.goto("http://localhost:3000", timeout=60000)

            # 2. Find the first project link
            first_project_link = page.locator("nav").first.locator("a").first
            expect(first_project_link).to_be_visible(timeout=15000)

            # 3. Hover over the link
            first_project_link.hover()

            # 4. Wait for the preview content to be visible
            # This is the most robust way to check. We find the container,
            # then assert that the main content within it is visible.
            preview_container = page.get_by_test_id("project-preview-container")
            project_content = preview_container.locator("main")

            # Use a generous timeout to avoid race conditions
            expect(project_content).to_be_visible(timeout=10000)

            # 5. Take a screenshot
            page.screenshot(path="jules-scratch/verification/preview_verification.png")
            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Save a screenshot on error for debugging
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()