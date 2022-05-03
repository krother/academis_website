import os
from academis.html_converter import markdown_to_article, directory_to_article
from academis.repository import AbstractContentRepository
from academis.config import TAGS, BASE_PATH



class MarkdownContentRepository(AbstractContentRepository):
    """
    Generates HTML content directly from Markdown files
    in the individual git repos of each category.
    """
    def get_article_list_html(self, tag):
        path = BASE_PATH + tag
        fn = path + "/README.md"
        text = open(fn).read()
        return markdown_to_article(text, tag, path)

    def get_article_html(self, tag, slug):
        path = BASE_PATH + tag
        fn = path + "/" + slug
        if os.path.isdir(fn):
            return directory_to_article(fn, tag)
        text = open(fn).read()
        return markdown_to_article(text, tag, path)

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


if __name__ == "__main__":
    repo = MarkdownContentRepository()
    for t, s in repo.get_all_slugs():
        print(t, s)
