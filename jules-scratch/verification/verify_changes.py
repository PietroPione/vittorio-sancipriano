from playwright.sync_api import sync_playwright, expect, Page

def verify_frontend_changes(page: Page):
    """
    This script verifies the following changes:
    1. The 'bio' page renders correctly without text being cut off.
    2. The project preview in the menu closes immediately upon clicking a project link.
    """
    # 1. Verify the 'bio' page layout
    print("Navigating to the 'bio' page...")
    page.goto("http://localhost:3000/bio")

    # Wait for the main content to be visible
    main_content = page.locator("main")
    expect(main_content).to_be_visible()

    # Check that the text container is present and visible
    text_container = main_content.locator("div").first
    expect(text_container).to_be_visible()

    print("Taking a screenshot of the 'bio' page...")
    page.screenshot(path="jules-scratch/verification/bio_page.png")
    print("Screenshot 'bio_page.png' captured.")

    # 2. Verify ProjectMenu navigation and preview behavior
    print("Navigating to the home page to test ProjectMenu...")
    page.goto("http://localhost:3000/")

    # Find the link for the "Corriere della Sera" project and hover over it
    # Note: The project name might be different, so we find a link that is not 'bio' or 'contacts'.
    # This is a bit brittle, but we'll assume a project link exists.
    # A more robust solution would be to have a known project slug.
    project_link = page.get_by_role("link", name="Corriere della Sera").first
    expect(project_link).to_be_visible()

    print("Hovering over a project to trigger the preview...")
    project_link.hover()

    # The preview should appear. We can check for the preview container.
    preview_container = page.locator('[data-testid="project-preview-container"]')
    expect(preview_container).to_be_visible()

    print("Taking screenshot with preview open...")
    page.screenshot(path="jules-scratch/verification/menu_preview.png")
    print("Screenshot 'menu_preview.png' captured.")

    # Now, click another project link
    print("Clicking another project link...")
    # Let's find another link to click.
    another_project_link = page.get_by_role("link", name="Mutti").first
    expect(another_project_link).to_be_visible()
    another_project_link.click()

    # The preview should disappear immediately, and we should navigate.
    # We expect the URL to change.
    expect(page).to_have_url("http://localhost:3000/mutti")

    # And the preview should not be visible.
    expect(preview_container).not_to_be_visible()

    print("Taking a screenshot of the new page to confirm preview is gone...")
    page.screenshot(path="jules-scratch/verification/after_click.png")
    print("Screenshot 'after_click.png' captured.")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_frontend_changes(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()