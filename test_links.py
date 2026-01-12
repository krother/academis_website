"""
Test all links on the main page using Playwright.

This script:
1. Serves the built website locally
2. Visits the index.html page
3. Extracts all links
4. Tests each link to ensure it returns a valid response
"""
import http.server
import socketserver
import threading
import time
from pathlib import Path
import pytest
from playwright.sync_api import Page

# Configuration
BUILD_DIR = Path(__file__).parent / "build"
BASE_URL = f"http://www.academis.eu"


class TestLinks:
    """Test class for link validation on the main page."""

    def test_all_links(self, page: Page):
        """Extract and test all links on the main page."""
        page.goto(f"{BASE_URL}/index.html")
        page.wait_for_load_state("networkidle")

        # Extract all links
        links = page.evaluate("""() => {
            const anchors = Array.from(document.querySelectorAll('a[href]'));
            return anchors.map(a => ({
                href: a.href,
                text: a.textContent.trim()
            }));
        }""")

        # Test each link
        failed_links = []
        visited = set()

        for link_data in links:
            url = link_data['href']
            text = link_data['text'][:50]  # Truncate long text

            # Skip mailto and javascript links
            if url in visited or url.startswith('mailto:') or url.startswith('javascript:'):
                continue

            # Identify external links
            is_external = not url.startswith(BASE_URL) and (
                url.startswith('http://') or url.startswith('https://')
            )
            visited.add(url)
            print(url)

            try:
                if is_external:
                    # For external links, just do a HEAD request
                    response = page.request.head(url, timeout=5000)
                    status = response.status
                else:
                    # For internal links, navigate and check
                    response = page.goto(url, timeout=5000, wait_until="domcontentloaded")
                    status = response.status if response else 200

                if status >= 400:
                    failed_links.append(f"{text} - {url} (Status: {status})")

            except Exception as e:
                failed_links.append(f"{text} - {url} (Error: {str(e)})")

        # Assert all links are valid
        assert not failed_links, f"Failed links:\n" + "\n".join(f"  - {link}" for link in failed_links)
