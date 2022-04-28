
import pytest
from academis.content import get_article_list_html, get_article_html, get_all_tags


def test_get_readme():
    article = get_article_list_html('python_basics')
    assert article.title == 'Python Exercises for Beginners'
    assert 'Ada Lovelace' in article.text

def test_get_article_html():
    article = get_article_html('python_basics', 'first_steps/for.md')
    assert article.title == 'Square Numbers'
    assert 'You are great at programming!' in article.text

TAGS = ['python_basics', 'teaching', 'advanced_python', 'python_reference'] 
# TODO 'games_EN'

@pytest.mark.parametrize('tag', TAGS)
def test_get_all_tags(tag):
    tags = get_all_tags()
    assert tag in tags