
import pytest
from academis.content import MarkdownContentRepository
from academis.config import TAGS


@pytest.fixture
def repo():
    return MarkdownContentRepository()

def test_get_readme(repo):
    article = repo.get_article_list_html('python_basics')
    assert article.title == 'Python Exercises for Beginners'
    assert 'Ada Lovelace' in article.text

def test_get_article_html(repo):
    article = repo.get_article_html('python_basics', 'first_steps/for.md')
    assert article.title == 'Square Numbers'
    assert 'You are great at programming!' in article.text

@pytest.mark.parametrize('tag', TAGS)
def test_get_all_tags(repo, tag):
    tags = repo.get_all_tags()
    assert tag in tags


def test_get_all_article_slugs(repo):
    slugs = repo.get_all_article_slugs('python_basics')
    assert len(slugs) >= 50
    assert 'first_steps/for.md' in slugs

@pytest.mark.xfail
def test_get_all_slugs(repo):
    s = repo.get_all_slugs()
    assert len(s) == 333
