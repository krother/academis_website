
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
    title = re.findall(r'#+\s(.+)', text)[0]
    # fix image links
    text = re.sub(r"!\[(.*)\]\(.+\/([^\/]+)\)", f"![\g<1>](/static/content/{tag}/\g<2>)", text)
    content = markdown.markdown(text, extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.codehilite'])
    content = wrap_images(content)
    return title, content

def get_readme(tag):
    path = BASE_PATH + tag
    readme_fn = path + '/README.md'
    text = open(readme_fn).read()
    text = re.sub("\* \[([^\]]+)\]\(([^\)]+)\)", f"* [\g<1>](/posts/{tag}/\g<2>)" , text)
    title, content = markdown_to_html(text, tag)
    return title, content


def get_post(tag, slug):
    fn = BASE_PATH + tag + '/' + slug
    text = open(fn).read()
    title, content = markdown_to_html(text, tag)
    return title, content
