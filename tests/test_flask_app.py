
import pytest
from academis.flask_app import app, repo


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
    
URLS =  ['/', '/impressum', '/cv', '/testimonials', '/publications'] + \
        [f'/{tag}' for tag in repo.get_all_tags()] + \
        [f'/posts/{tag}/{slug}' for tag, slug in repo.get_all_slugs()]


@pytest.mark.parametrize('url', URLS)
def test_url(client, url):
    assert client.get(url).status == '200 OK'

def test_file(client):
    assert client.get('/files/python_basics/images/ada.jpg').status == '200 OK'

@pytest.mark.no_ci
def test_url_number():
    assert len(URLS) > 400
