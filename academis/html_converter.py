import os
import re
import markdown
from dataclasses import dataclass

STATIC_WILDCARDS = 'png,gif,svg,jpg,zip,pdf,csv'.split(',')

FILETYPES_TO_ADD = {'.md', '.py'}


@dataclass
class Article:
    """Data objects the Flask app needs"""

    title: str
    text: str
    links: list
    files: list


class Link:
    """Resolves paths to URLs"""
    def __init__(self, link, path, subdir, tag):
        self.link = link
        self.path = path
        self.subdir = subdir
        self.tag = tag

    @property
    def is_internal(self):
        return not (
            self.link.startswith('http') or 
            self.link.startswith('www') or
            self.link.startswith('mailto')
            )

    @property
    def is_article(self):
        return self.link.endswith('.md') or self.link.endswith('/')

    @property
    def is_static(self):
        return self.link[-3:] in STATIC_WILDCARDS

    @property
    def full_filepath(self):
        fp = os.path.join(self.path, self.subdir, self.link)
        if self.subdir:
            fp = fp.replace(f'{self.subdir}/../', '')
        return fp

    @property
    def slug(self):
        slug = self.link
        if self.subdir:
            slug = f'{self.subdir}/' + slug
            slug = slug.replace(f'{self.subdir}/../', '')
        return slug

    @property
    def url(self):        
        if self.is_article:
            url = f'/posts/{self.tag}/{self.slug}'
        elif self.is_static:
            url = f'/files/{self.tag}/{self.slug}'
        else:
            raise ValueError(f'unknown link type: {self.link}')
        return url



class LinkBuilder:
    """
    Replaces internal hyperlinks in markdown format
    by relative URLs.
    Implements the Builder Pattern.
    """
    def __init__(self, text, tag, path, subdir):
        self.text = text
        self.tag = tag
        self.path = path
        self.subdir = subdir
        self.file_slugs = []
        self.files = []
        self.links = []

    @property
    def hyperlinks(self):
        for link in re.findall(r'\[[^\]]*\]\(([^\)]+)\)', self.text):
            yield Link(link, self.path, self.subdir, self.tag)
            
    def replace_file_directives(self):
        """takes care of :::file xyz directive"""
        self.text = re.sub(r':::file ([^\s]+)', r'[\1](\1)', self.text)

    def add_file(self, link):
        self.files.append(open(link.full_filepath, 'rb').read())
        self.file_slugs.append(link.slug)

    def insert_links(self):
        """Replaces the hyperlinks in the markdown document"""
        self.replace_file_directives()
        for link in self.hyperlinks:
            if link.is_internal:
                self.text = self.text.replace(f'({link.link})', f'({link.url})')
                if link.is_article:
                    self.links.append(link.slug)
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


def markdown_to_html(text, tag, path, subdir=''):
    title = re.findall(r"#+\s(.+)", text)
    title = title[0] if title else ""

    text, _ = replace_includes(text, path)

    bl = LinkBuilder(text, tag, path, subdir)
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
        self.maindir, self.subdir = os.path.split(path)
        self.tag = tag
        self.text = ""
        self.title = self.tag.capitalize()
        self._included = []

    def add_markdown(self, raw):
        title, content, _, includes = markdown_to_html(raw, self.tag, self.maindir, self.subdir)
        self.title = title
        self.text += content
        self._included += includes

    def add_python_code(self, fn, raw):
        filename = os.path.split(fn)[-1]
        code = "".join(["    " + x for x in raw.split('\n')])
        code = markdown_to_html(code, "-", self.path)[1]
        self.text += f"\n<hr>\n<h2>{filename}</h2>\n{code}"

    def add_file(self, fn):
        raw = open(fn).read()
        if fn.endswith(".md"):
            self.add_markdown(raw)
        elif fn.endswith(".py") and fn not in self._included:
            self.add_python_code(fn, raw)
 
    def process_dir(self):
        for filename in sorted(os.listdir(self.path)):
            fn = os.path.join(self.path, filename)
            if os.path.isfile(fn) and fn[-3:] in FILETYPES_TO_ADD:
                #TODO: try pattern matching
                self.add_file(fn)

    def get_article(self):
        return Article(self.title, self.text, [], [])


def directory_to_article(path, tag):
    artgen = ArticleFromFiles(path, tag)
    artgen.process_dir()
    return artgen.get_article()


def markdown_to_article(text, tag, path):
    """Converts a Markdown text to an Article object"""
    return Article(*markdown_to_html(text, tag, path))
