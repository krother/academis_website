
import os
from academis.html_converter import markdown_to_article, directory_to_article


BASE_PATH = os.path.join(os.path.split(__file__)[0], '../content/')

def get_all_tags():
    return os.listdir(BASE_PATH)

def get_article_list_html(tag):
    fn = BASE_PATH + tag + '/README.md'
    text = open(fn).read()
    return markdown_to_article(text, tag)


def get_article_html(tag, slug):
    fn = BASE_PATH + tag + '/' + slug
    if os.path.isdir(fn):
        return directory_to_article(fn, tag)
    text = open(fn).read()
    return markdown_to_article(text, tag)
