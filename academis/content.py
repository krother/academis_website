import os
from academis.html_converter import markdown_to_article, directory_to_article


BASE_PATH = os.path.join(os.path.split(__file__)[0], "../content/")


def get_article_list_html(tag):
    fn = BASE_PATH + tag + "/README.md"
    text = open(fn).read()
    return markdown_to_article(text, tag)


def get_article_html(tag, slug):
    fn = BASE_PATH + tag + "/" + slug
    if os.path.isdir(fn):
        return directory_to_article(fn, tag)
    text = open(fn).read()
    return markdown_to_article(text, tag)


def get_all_tags():
    return os.listdir(BASE_PATH)


def get_all_article_slugs(tag):
    a = get_article_list_html(tag)
    return a.links


def get_all_slugs():
    result = []
    for tag in get_all_tags():
        result += [(tag, slug) for slug in get_all_article_slugs(tag)]
    return result


if __name__ == "__main__":
    for t, s in get_all_slugs():
        print(t, s)
