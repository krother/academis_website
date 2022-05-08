
import pytest
from academis.html_converter import markdown_to_article, LinkBuilder
from testconf import TEST_DATA_PATH


def test_link_builder():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    builder = LinkBuilder(md, tag='test', path=TEST_DATA_PATH)
    builder.insert_links()

    assert 'brain.png' in builder.file_slugs
    assert 'images/python.gif' in builder.file_slugs
    assert 'images/gauss.jpg' in builder.file_slugs
    assert 'stuff.zip' in builder.file_slugs
    assert 'more_stuff.zip' in builder.file_slugs

    assert '/files/test/brain.png' in builder.text
    assert '/files/test/images/python.gif' in builder.text
    assert '/files/test/stuff.zip' in builder.text
    assert '/files/test/images/gauss.jpg' in builder.text
    assert '/files/test/www.coolpa.ge' not in builder.text

    assert 'other.md' in builder.links
    assert 'hello_world/' in builder.links

    print(builder.text)    
    assert '/test/other.md' in builder.text
    assert '/test/hello_world/' in builder.text


def test_markdown_to_article():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    article = markdown_to_article(md, 'test', path=TEST_DATA_PATH)
    assert len(article.files) == 6
    assert len(article.links) == 2
    assert '/files/test/images/python.gif' in article.text
    assert '<h1>' in article.text

