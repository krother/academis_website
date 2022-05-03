
import pytest
from academis.html_converter import fix_links, markdown_to_article, LinkBuilder
from testconf import TEST_DATA_PATH

SUBS = [
    # normal content unmodified
    ('', 'python', ''),
    ('foo', 'python', 'foo'),

    # TOC links
    ('* [foo](bar)', 'python', '* [foo](/posts/python/bar)'),
    ('* [foo](bar/bin.md)', 'python', '* [foo](/posts/python/bar/bin.md)'),
    ('* [foo](http://bar)', 'python', '* [foo](http://bar)'),
    ('| [foo](bar) |', 'python', '| [foo](/posts/python/bar) |'),
    ('| [foo](http://bar) |', 'python', '| [foo](http://bar) |'),

    # image links
    ('![foo](images/bar.png)', 'python', '![foo](/static/content/python/bar.png)'),
    ('![foo](../images/bar.png)', 'python', '![foo](/static/content/python/bar.png)'),

]

@pytest.mark.parametrize(['text', 'tag', 'expected'], SUBS)
def test_fix_links(text, tag, expected):
    assert fix_links(text, tag) == expected


def test_link_builder():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    builder = LinkBuilder(md, tag='test', path=TEST_DATA_PATH)
    builder.insert_links()

    assert '/static/test/brain.png' in builder.file_slugs
    assert '/static/test/images/python.gif' in builder.file_slugs
    assert '/static/test/images/gauss.jpg' in builder.file_slugs
    assert '/static/test/stuff.zip' in builder.file_slugs

    assert 'other.md' in builder.links
    assert 'hello_world/' in builder.links

    assert '/static/test/brain.png' in builder.text
    assert '/static/test/images/python.gif' in builder.text
    assert '/static/test/stuff.zip' in builder.text
    assert '/static/test/images/gauss.jpg' in builder.text
    assert '/static/test/www.coolpa.ge' not in builder.text


def test_markdown_to_article():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    article = markdown_to_article(md, 'test', path=TEST_DATA_PATH)
    assert len(article.files) == 5
    assert len(article.links) == 2
    assert '/images/python.gif' in article.text
    assert '<h1>' in article.text

