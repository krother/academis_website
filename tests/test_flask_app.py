
import pytest
import re
from academis.flask_app import app
from academis.content import get_all_tags, get_all_slugs

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
    

URLS = ['/', '/impressum', '/cv', '/testimonials', '/publications']
URLS += [f'/{tag}' for tag in get_all_tags()]
URLS += [f'/posts/{tag}/{slug}' for tag, slug in get_all_slugs()]
#TODO: /courses

@pytest.mark.parametrize('url', URLS)
def test_url(client, url):
    assert client.get(url).status == '200 OK'
