import os
import re
import markdown
from dataclasses import dataclass


@dataclass
class Article:
    """Data objects the Flask app needs"""

    title: str
    text: str
    linked_files: list


class LinkBuilder:
    """
    Replaces internal hyperlinks in markdown format
    by relative URLs.
    Implements the Builder Pattern.
    """
    pass

def get_file_links(content):
    links = re.findall(r'\[[^\]]+\]\(([^\)]+)\)', content)
    return [lk for lk in links if not lk.startswith('http')]

#    img = open(fn, 'rb').read()

def wrap_images(content):
    """Add extra div tag to content"""
    content = re.sub(r"(\<img [^\>]+\>)", r'<div class="media">\1</div>', content)
    content = re.sub(r"\<img ([^\>]+\>)", r'<img class="media-object" \1', content)
    return content


def fix_links(text, tag):
    """
    Hammer on the links to documents and images
    so that they point to URLs in Flask
    and still work on GitHub.
    Supports both HTML and Markdown image links
    """
    text = re.sub(
        r"\* \[([^\]]+)\]\((?!http)([^\)]+)\)",
        r"* [\g<1>](/posts/{}/\g<2>)".format(tag),
        text,
    )
    text = re.sub(
        r"\| \[([^\]]+)\]\((?!http)([^\)]+)\)",
        r"| [\g<1>](/posts/{}/\g<2>)".format(tag),
        text,
    )
    text = re.sub(
        r"\<img src=\"(.+\/)?([^\"\/]+)\"",
        r'<img src="/static/content/{}/\g<2>"'.format(tag),
        text,
    )

    text = re.sub(r"!\[(.*)\]\(\.\.\/([^\)]+)\)", r"![\g<1>](\g<2>)", text)
    text = re.sub(
        r"!\[(.*)\]\([^\/]+\/([^\)]+)\)",
        r"![\g<1>](/static/content/{}/\g<2>)".format(tag),
        text,
    )
    text = re.sub(
        r":::file ([^\s]+)", r"[\g<1>](/static/content/{}/\g<1>)".format(tag), text
    )
    return text


def replace_includes(text, path):
    """resolves :::include xx.py directives"""
    included = []
    for pyfile in re.findall(r"\:\:\:include (\w+\.py)", text, re.IGNORECASE):
        py = open(path + pyfile).read()
        pyform = "\n    :::python3\n    " + py.replace("\n", "\n    ")
        text = text.replace(":::include " + pyfile, pyform)
        included.append(pyfile)
    return text, included


def markdown_to_html(text, tag):
    title = re.findall(r"#+\s(.+)", text)
    title = title[0] if title else ""
    text = fix_links(text, tag)
    links = re.findall(r"/posts/" + tag + r"/([^)]+)\)", text)

    text, includes = replace_includes(text, path)

    content = markdown.markdown(
        text,
        extensions=["markdown.extensions.tables", "markdown.extensions.codehilite"],
    )
    content = wrap_images(content)
    return title, content, links, includes



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

    def add_markdown(self, raw)
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
 
    def process_dir(self, path):
        for filename in sorted(os.listdir(path)):
            fn = os.path.join(path, filename)
            #TODO: try pattern matching
            self.add_file(fn)

    def get_article(self):
        return Article(self.title, self.text, [])


def directory_to_article(path, tag):
    artgen = ArticleFromFiles(tag)
    artgen.process_dir(path)
    return artgen.get_article()


def markdown_to_article(text, tag):
    """Converts a Markdown text to an Article object"""
    return Article(*markdown_to_html(text, tag))
