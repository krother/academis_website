
import os
import re
import markdown

BASE_PATH = os.path.split(__file__)[0] + '/content/'

def wrap_images(content):
    """Add extra div tag to content"""
    content = re.sub(r'(\<img [^\>]+\>)', r'<div class="media">\1</div>', content)
    content = re.sub(r'\<img ([^\>]+\>)', r'<img class="media-object" \1', content)
    return content

def markdown_to_html(text, tag):
    title = re.findall(r'#+\s(.+)', text)
    title = title[0] if title else ''
    # fix image links
    text = re.sub(r"!\[(.*)\]\(.+\/([^\/]+)\)", f"![\g<1>](/static/content/{tag}/\g<2>)", text)
    content = markdown.markdown(text, extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.codehilite'])
    content = wrap_images(content)
    return title, content


def format_code(f):
    code = ''.join(['    ' + x for x in f])
    return markdown_to_html(code, '-')[1]


def get_readme(tag):
    path = BASE_PATH + tag
    readme_fn = path + '/README.md'
    text = open(readme_fn).read()
    text = re.sub("\* \[([^\]]+)\]\(([^\)]+)\)", f"* [\g<1>](/posts/{tag}/\g<2>)" , text)
    title, content = markdown_to_html(text, tag)
    return title, content

def read_dir(path, tag):
    out = ''
    title = tag.capitalize()
    for filename in os.listdir(path):
        if filename.endswith('.md'):
            s = open(path + filename).read()
            title, content = markdown_to_html(s, tag)
            out = content + out
        elif filename.endswith('.py'):
            code = format_code(open(path + filename))
            out += f'\n<hr>\n<h2>{filename}</h2>\n{code}'
    return title, out


def get_post(tag, slug):
    fn = BASE_PATH + tag + '/' + slug
    if os.path.isdir(fn):
        return read_dir(fn, tag)
    text = open(fn).read()
    title, content = markdown_to_html(text, tag)
    return title, content