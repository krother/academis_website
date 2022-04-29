
import pytest
from academis.db_content import (
    get_article_list_html,
    get_article_html,
    get_all_tags,
    get_all_article_slugs,
    get_all_slugs
)


def test_get_readme():
    article = get_article_list_html('python_basics')
    assert article.title == 'Python Exercises for Beginners'
    assert 'Ada Lovelace' in article.text

def test_get_article_html():
    article = get_article_html('python_basics', 'first_steps/for.md')
    assert article.title == 'Square Numbers'
    assert 'You are great at programming!' in article.text

TAGS = [
    'python_basics', 'teaching', 'advanced_python', 'python_reference', 'generative_art', 
    'software_engineering_EN', 'data_analysis_EN', 'grafik_DE',
    ] 
# TODO 'games_EN'

@pytest.mark.parametrize('tag', TAGS)
def test_get_all_tags(tag):
    tags = get_all_tags()
    assert tag in tags

def test_get_all_article_slugs():
    slugs = get_all_article_slugs('python_basics')
    assert len(slugs) >= 50
    assert 'first_steps/for.md' in slugs

@pytest.mark.xfail
def test_get_all_slugs():
    s = get_all_slugs()
    assert len(s) == 333
