
import pytest
from content import fix_links

SUBS = [
    ('', 'xxx', ''),
    ('foo', 'bar', 'foo'),
    ('* [foo](bar)', 'spam', '* [foo](/posts/spam/bar)'),
    ('* [foo](bar/bin.md)', 'spam', '* [foo](/posts/spam/bar/bin.md)'),
    ('* [foo](http://bar)', 'spam', '* [foo](http://bar)'),
    ('| [foo](bar) |', 'spam', '| [foo](/posts/spam/bar) |'),
    ('| [foo](http://bar) |', 'spam', '| [foo](http://bar) |'),
    ('![foo](eggs/bar.png)', 'spam', '![foo](/static/content/spam/bar.png)'),
    ('![foo](../eggs/bar.png)', 'spam', '![foo](/static/content/spam/bar.png)'),

]

@pytest.mark.parametrize(['text', 'tag', 'expected'], SUBS)
def test_fix_links(text, tag, expected):
    assert fix_links(text, tag) == expected
