import os

from academis.config import BASE_PATH, TAGS
from academis.html_converter import (directory_to_article,
                                     markdown_file_to_article)
from academis.repository import AbstractContentRepository


class MarkdownContentRepository(AbstractContentRepository):
    """
    Generates HTML content directly from Markdown files
    in the individual git repos of each category.
    """

    def get_article_list_html(self, tag):
        path = BASE_PATH + tag
        return markdown_file_to_article(tag, path, 'README.md')

    def get_article_html(self, tag, slug):
        path = BASE_PATH + tag
        fn = os.path.join(path, slug)
        if os.path.isdir(fn):
            return directory_to_article(fn, tag)
        article = markdown_file_to_article(tag, path, slug)
        return article

    def get_all_tags(self):
        return TAGS

    def get_all_article_slugs(self, tag):
        a = self.get_article_list_html(tag)
        return a.links

    def get_all_slugs(self):
        result = []
        for tag in self.get_all_tags():
            result += [(tag, slug) for slug in self.get_all_article_slugs(tag)]
        return result

    def get_file(self, tag, slug):
        fn = os.path.join(BASE_PATH, tag, slug)
        return open(fn, 'rb').read()


if __name__ == "__main__":
    repo = MarkdownContentRepository()
    for t, s in repo.get_all_slugs():
        print(t, s)
