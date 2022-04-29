
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
