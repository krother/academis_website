
import pytest
from academis.html_converter import (
    markdown_to_article,
    directory_to_article,
    LinkBuilder,
    Link
)
from testconf import TEST_DATA_PATH


@pytest.mark.parametrize('link, path, subdir, tag, url', [
 
    ('image_and_file_links.md', TEST_DATA_PATH, '', 'test', '/posts/test/image_and_file_links.md'),
    ('article_dir/README.md', TEST_DATA_PATH, '', 'test', '/posts/test/article_dir/README.md'),

    ('brain.png', TEST_DATA_PATH, '', 'test', '/files/test/brain.png'),
    ('images/gauss.jpg', TEST_DATA_PATH, '', 'test', '/files/test/images/gauss.jpg'),
    ('images/subfolder/teaching.png', TEST_DATA_PATH, '', 'test', '/files/test/images/subfolder/teaching.png'),
    ('../images/brain.png', TEST_DATA_PATH, 'article_dir', 'test', '/files/test/images/brain.png'),

    ('stuff.zip', TEST_DATA_PATH, '', 'test', '/files/test/stuff.zip'),
    ('more_stuff.zip', TEST_DATA_PATH, '', 'test', '/files/test/more_stuff.zip'),
    ('file_in_subfolder.zip', TEST_DATA_PATH, 'article_dir', 'test', '/files/test/article_dir/file_in_subfolder.zip'),
])
def test_link_to_url(link, path, subdir, tag, url):
    link = Link(link, path, subdir, tag)
    assert link.url == url


@pytest.mark.parametrize('link, path, subdir, tag, filepath', [
 
    ('image_and_file_links.md', TEST_DATA_PATH, '', 'test', TEST_DATA_PATH + '/image_and_file_links.md'),
    ('article_dir/README.md', TEST_DATA_PATH, '', 'test',  TEST_DATA_PATH + '/article_dir/README.md'),

    ('brain.png', TEST_DATA_PATH, '', 'test', TEST_DATA_PATH + '/brain.png'),
    ('images/gauss.jpg', TEST_DATA_PATH, '', 'test', TEST_DATA_PATH + '/images/gauss.jpg'),
    ('images/subfolder/teaching.png', TEST_DATA_PATH, '', 'test', TEST_DATA_PATH + '/images/subfolder/teaching.png'),
    ('../images/brain.png', TEST_DATA_PATH, 'article_dir', 'test', TEST_DATA_PATH + '/images/brain.png'),

    ('stuff.zip', TEST_DATA_PATH, '', 'test', TEST_DATA_PATH + '/stuff.zip'),
    ('more_stuff.zip', TEST_DATA_PATH, '', 'test', TEST_DATA_PATH + '/more_stuff.zip'),
    ('file_in_subfolder.zip', TEST_DATA_PATH, 'article_dir', 'test', TEST_DATA_PATH + '/article_dir/file_in_subfolder.zip'),
])
def test_link_to_filepath(link, path, subdir, tag, filepath):
    link = Link(link, path, subdir, tag)
    assert link.full_filepath == filepath



def test_link_builder():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    builder = LinkBuilder(md, tag='test', path=TEST_DATA_PATH, subdir='')
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

    assert '/test/other.md' in builder.text
    assert '/test/hello_world/' in builder.text


def test_markdown_to_article():
    md = open(TEST_DATA_PATH + '/image_and_file_links.md').read()
    article = markdown_to_article(md, 'test', path=TEST_DATA_PATH)
    assert len(article.files) == 6
    assert len(article.links) == 2
    assert '/files/test/images/python.gif' in article.text
    assert '<h1>' in article.text


def test_directory_to_article():
    a = directory_to_article(TEST_DATA_PATH + '/article_dir', 'test')
    assert 'To get a hello world message' in a.text
    assert a.text.count('print') == 2
    assert 'article_dir/images' not in a.text
