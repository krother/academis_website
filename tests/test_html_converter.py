
import pytest
from academis.html_converter import fix_links, get_file_links
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

def test_get_file_links():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    result = get_file_links(md)
    assert len(result) == 4
    assert result[0][0] == '/images/unicorn.png'

def test_link_builder():
    ...
