import os
import re
import markdown
from dataclasses import dataclass

STATIC_WILDCARDS = 'png,gif,svg,jpg,zip,pdf'.split(',')


@dataclass
class Article:
    """Data objects the Flask app needs"""

    title: str
    text: str
    links: list
    files: list


class LinkBuilder:
    """
    Replaces internal hyperlinks in markdown format
    by relative URLs.
    Implements the Builder Pattern.
    """
    def __init__(self, text, tag, path):
        self.text = text
        self.tag = tag
        self.path = path
        self.file_slugs = []
        self.files = []
        self.links = []

    @property
    def hyperlinks(self):
        return re.findall(r'\[[^\]]*\]\(([^\)]+)\)', self.text)

    @staticmethod
    def is_internal(link):
        return not (link.startswith('http') or link.startswith('www'))

    @staticmethod
    def is_markdown_link(link):
        return link.endswith('.md') or link.endswith('/')

    def replace_file_directives(self):
        """takes care of :::file xyz directive"""
        self.text = re.sub(r':::file ([^\s]+)', r'[\1](\1)', self.text)

    def create_relative_link(self, link):
        if link[-3:].lower() in STATIC_WILDCARDS:
            link = re.sub(r'^\.\.\/?', '', link)
            return f'/files/{self.tag}/{link}'
        elif self.is_markdown_link(link):
            return f'/posts/{self.tag}/{link}'
        else:
            raise ValueError(f'unknown link type: {link}')

    def add_file(self, link):
        link = re.sub(r'^\.\./', '', link)
        fn = os.path.join(self.path, link)
        self.files.append(open(fn, 'rb').read())
        self.file_slugs.append(link)

    def insert_links(self):
        """Replaces the hyperlinks in the markdown document"""
        self.replace_file_directives()
        for link in self.hyperlinks:
            if self.is_internal(link):
                rel = self.create_relative_link(link)
                self.text = self.text.replace(f'({link})', f'({rel})')
                if self.is_markdown_link(link):
                    self.links.append(link)
                else:
                    self.add_file(link)


def wrap_images(content):
    """Add extra div tag to content"""
    content = re.sub(r"(\<img [^\>]+\>)", r'<div class="media">\1</div>', content)
    content = re.sub(r"\<img ([^\>]+\>)", r'<img class="media-object" \1', content)
    return content


def replace_includes(text, path):
    """resolves :::include xx.py directives"""
    included = []
    for pyfile in re.findall(r"\:\:\:include (\w+\.py)", text, re.IGNORECASE):
        py = open(path + pyfile).read()
        pyform = "\n    :::python3\n    " + py.replace("\n", "\n    ")
        text = text.replace(":::include " + pyfile, pyform)
        included.append(pyfile)
    return text, included


def markdown_to_html(text, tag, path):
    title = re.findall(r"#+\s(.+)", text)
    title = title[0] if title else ""

    text, _ = replace_includes(text, path)

    bl = LinkBuilder(text, tag, path)
    bl.insert_links()

    content = markdown.markdown(
        bl.text,
        extensions=["markdown.extensions.tables", "markdown.extensions.codehilite"],
    )
    content = wrap_images(content)
    return title, content, bl.links, list(zip(bl.file_slugs, bl.files))



class ArticleFromFiles:
    """
    Concatenates all files in a directory into a single article.
    Implements the Builder Pattern
    """
    def __init__(self, path, tag):
        self.path = path
        self.tag = tag
        self.text = ""
        self.title = self.tag.capitalize()
        self._included = []

    def add_markdown(self, raw):
        title, content, _, includes = markdown_to_html(raw, self.tag)
        self.title = title
        self.text += content
        self._included += includes

    def add_python_code(self, fn, raw):
        filename = os.path.split(fn)[-1]
        code = "".join(["    " + x for x in raw.split('\n')])
        code = markdown_to_html(code, "-")[1]
        text += f"\n<hr>\n<h2>{filename}</h2>\n{code}"

    def add_file(self, fn):
        raw = open(fn).read()
        if fn.endswith(".md"):
            self.add_markdown(raw)
        elif fn.endswith(".py") and fn not in self._included:
            self.add_python_code(fn, raw)
 
    def process_dir(self):
        for filename in sorted(os.listdir(self.path)):
            fn = os.path.join(self.path, filename)
            #TODO: try pattern matching
            self.add_file(fn)

    def get_article(self):
        return Article(self.title, self.text, [], [])


def directory_to_article(path, tag):
    artgen = ArticleFromFiles(tag)
    artgen.process_dir(path)
    return artgen.get_article()


def markdown_to_article(text, tag, path):
    """Converts a Markdown text to an Article object"""
    return Article(*markdown_to_html(text, tag, path))
