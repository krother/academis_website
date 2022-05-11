import os
import re
import markdown
from dataclasses import dataclass

STATIC_WILDCARDS = 'py,ipynb,png,gif,svg,jpg,zip,pdf,csv,ttf,sql,xlsx,fasta,gbk,pdb,TXT'.split(',')

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

    def __repr__(self):
        return f"<link: '{self.link}', path: '{self.path}', subdir: '{self.subdir}', tag: '{self.tag}'>"

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
        return self.link.split('.')[-1] in STATIC_WILDCARDS

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
        py = open(os.path.join(path, pyfile)).read()
        pyform = "\n    :::python3\n    " + py.replace("\n", "\n    ")
        text = text.replace(":::include " + pyfile, pyform)
        included.append(pyfile)
    return text, included


def markdown_to_html(text):
    content = markdown.markdown(
        text,
        extensions=["markdown.extensions.tables", "markdown.extensions.codehilite"],
    )
    content = wrap_images(content)
    return content


def markdown_file_to_html(tag, path, filepath):
    fn = os.path.join(path, filepath)
    text = open(fn).read()

    title = re.findall(r"#+\s(.+)", text)
    title = title[0] if title else ""

    subdir, _ = os.path.split(filepath)

    text, included = replace_includes(text, os.path.join(path, subdir))

    bl = LinkBuilder(text, tag, path, subdir)
    bl.insert_links()
    content = markdown_to_html(bl.text)

    return title, content, bl.links, list(zip(bl.file_slugs, bl.files)), included



class ArticleFromFiles:
    """
    Concatenates all files in a directory into a single article.
    Implements the Builder Pattern
    """
    def __init__(self, path, tag):
        self.path = path
        self.maindir, self.subdir = os.path.split(path.rstrip('/'))
        self.tag = tag
        self.text = ""
        self.title = self.tag.capitalize()
        self.links = []
        self.files = []
        self._included = []

    def add_markdown(self, fn):
        fn = os.path.join(self.subdir, fn)
        title, content, links, files, includes = markdown_file_to_html(self.tag, self.maindir, fn)
        self.title = title
        self.text += content
        self.links += links
        self.files += files
        self._included += includes

    def add_python_code(self, fn):
        fn = os.path.join(self.maindir, self.subdir, fn)
        raw = open(fn).read()
        filename = os.path.split(fn)[-1]
        code = "\n".join(["    " + x for x in raw.split('\n')])
        code = "\n    :::python\n" + code
        code = markdown_to_html(code)
        self.text += f"\n<hr>\n<h2>{filename}</h2>\n{code}"

    def add_file(self, fn):
        if fn.endswith(".md"):
            self.add_markdown(fn)
        elif fn.endswith(".py") and fn not in self._included:
            self.add_python_code(fn)
 
    def process_dir(self):
        for filename in sorted(os.listdir(self.path)):
            fn = os.path.join(self.path, filename)
            if os.path.isfile(fn) and fn[-3:] in FILETYPES_TO_ADD:
                self.add_file(filename)

    def get_article(self):
        return Article(self.title, self.text, self.links, self.files)


def directory_to_article(path, tag):
    artgen = ArticleFromFiles(path, tag)
    artgen.process_dir()
    return artgen.get_article()


def markdown_file_to_article(tag, path, filename):
    """Converts a Markdown text to an Article object"""
    title, text, links, files, _ = markdown_file_to_html(tag, path, filename)
    return Article(title, text, links, files)
