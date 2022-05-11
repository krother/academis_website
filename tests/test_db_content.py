
import pytest

from academis.config import TAGS
from academis.db_content import SQLContentRepository


@pytest.fixture
def repo():
    return SQLContentRepository()


@pytest.mark.no_ci
def test_get_readme(repo):
    article = repo.get_article_list_html('python_basics')
    assert article.title == 'Python Exercises for Beginners'
    assert 'Ada Lovelace' in article.text


@pytest.mark.no_ci
def test_get_article_html(repo):
    article = repo.get_article_html('python_basics', 'first_steps/for.md')
    assert article.title == 'Square Numbers'
    assert 'You are great at programming!' in article.text


@pytest.mark.no_ci
@pytest.mark.parametrize('tag', TAGS)
def test_get_all_tags(tag, repo):
    tags = repo.get_all_tags()
    assert tag in tags


@pytest.mark.no_ci
def test_get_all_article_slugs(repo):
    slugs = repo.get_all_article_slugs('python_basics')
    assert len(slugs) >= 50
    assert 'first_steps/for.md' in slugs


@pytest.mark.no_ci
def test_get_all_slugs(repo):
    s = repo.get_all_slugs()
    assert len(s) > 300
