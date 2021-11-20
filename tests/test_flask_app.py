
import pytest
import re
from academis.flask_app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
    

#SITEMAP = open('sitemap.txt').read()
#URLS = set(re.findall('http.+', SITEMAP))
URLS = ['/', '/teaching']

@pytest.mark.parametrize('url', URLS)
def test_url(client, url):
    assert client.get(url).status == '200 OK'
