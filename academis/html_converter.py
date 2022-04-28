
import re
import markdown
from dataclasses import dataclass


@dataclass
class Article:
    """Data objects the Flask app needs"""
    title: str
    text: str


def wrap_images(content):
    """Add extra div tag to content"""
    content = re.sub(r'(\<img [^\>]+\>)', r'<div class="media">\1</div>', content)
    content = re.sub(r'\<img ([^\>]+\>)', r'<img class="media-object" \1', content)
    return content

def fix_links(text, tag):
    """
    Hammer on the links to documents and images
    so that they point to URLs in Flask
    and still work on GitHub.
    Supports both HTML and Markdown image links
    """
    text = re.sub(r"\* \[([^\]]+)\]\((?!http)([^\)]+)\)", r"* [\g<1>](/posts/{}/\g<2>)".format(tag) , text)
    text = re.sub(r"\| \[([^\]]+)\]\((?!http)([^\)]+)\)", r"| [\g<1>](/posts/{}/\g<2>)".format(tag) , text)
    text = re.sub(r'\<img src=\"(.+\/)?([^\"\/]+)\"', r'<img src="/static/content/{}/\g<2>"'.format(tag), text)

    text = re.sub(r"!\[(.*)\]\(\.\.\/([^\)]+)\)", r"![\g<1>](\g<2>)", text)
    text = re.sub(r"!\[(.*)\]\([^\/]+\/([^\)]+)\)", r"![\g<1>](/static/content/{}/\g<2>)".format(tag), text)
    text = re.sub(r":::file ([^\s]+)", r"[\g<1>](/static/content/{}/\g<1>)".format(tag), text)
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
    title = re.findall(r'#+\s(.+)', text)
    title = title[0] if title else ''
    text = fix_links(text, tag)

    content = markdown.markdown(text, extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.codehilite'])
    content = wrap_images(content)
    return title, content

def format_code(f):
    code = ''.join(['    ' + x for x in f])
    return markdown_to_html(code, '-')[1]

def directory_to_article(path, tag):
    out = ''
    title = tag.capitalize()
    included = []
    for filename in sorted(os.listdir(path)):
        if filename.endswith('.md'):
            s = open(path + filename).read()
            s, inc = replace_includes(s, path)
            included += inc
            title, content = markdown_to_html(s, tag)
            out = content + out
        elif filename.endswith('.py') and filename not in included:
            code = format_code(open(path + filename))
            out += f'\n<hr>\n<h2>{filename}</h2>\n{code}'
    return Article(title, out)

def markdown_to_article(text, tag):
    return Article(*markdown_to_html(text, tag))
