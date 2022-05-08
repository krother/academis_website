
from abc import ABC, abstractmethod


class AbstractContentRepository(ABC):
    """
    Base class for website content interface
    """
    @abstractmethod
    def get_article_list_html(self, tag):
        pass

    @abstractmethod
    def get_article_html(self, tag, slug):
        pass

    @abstractmethod
    def get_all_tags(self):
        pass

    @abstractmethod
    def get_all_article_slugs(self, tag):
        pass

    @abstractmethod
    def get_all_slugs(self):
        pass

    @abstractmethod
    def get_file(self, tag, slug):
        pass

    def get_all_articles(self, verbose=False):
        """Iterates over all articles"""
        for tag in self.get_all_tags():
            print(f"\nprocessing {tag}")

            # TOC article
            a = self.get_article_list_html(tag)
            yield tag, None, a

            # normal post
            for slug in self.get_all_article_slugs(tag):
                if verbose:
                    print(slug)
                else:
                    print(".", end="")
                a = self.get_article_html(tag, slug)
                yield tag, slug, a
