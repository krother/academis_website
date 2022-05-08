
import pytest
from academis.flask_app import app
from academis.content import MarkdownContentRepository

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
    

def get_all_urls():
    repo = MarkdownContentRepository()
    urls = ['/', '/impressum', '/cv', '/testimonials', '/publications']
    urls += [f'/{tag}' for tag in repo.get_all_tags()]
    urls += [f'/posts/{tag}/{slug}' for tag, slug in repo.get_all_slugs()]
    return urls

@pytest.mark.parametrize('url', get_all_urls())
def test_url(client, url):
    assert client.get(url).status == '200 OK'

def test_file(client):
    assert client.get('/files/python_basics/images/ada.jpg').status == '200 OK'
