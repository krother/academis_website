# Academis Website

(c) 2025 Dr. Kristian Rother

Distributed under the conditions of the Creative Commons Attribution Share-alike License 4.0.


## Start locally

1. install Python
2. `pip install uv`
3. `uv sync`
4. `make build`
5. open `build/index.html` in your browser

## Test links

To test all links on the main page:

1. Install Playwright browsers: `uv run playwright install chromium`
2. Build the site: `make build`
3. Run the test: `uv run test_links.py`

The script will start a local server, visit all links on the index page, and report which ones work and which ones fail. 
