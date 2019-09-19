
import os
import re
import markdown

BASE_PATH = os.path.split(__file__)[0] + '/content/'

def wrap_images(content):
    """Add extra div tag to content"""
    content = re.sub(r'(\<img [^\>]+\>)', r'<div class="media">\1</div>', content)
    content = re.sub(r'\<img ([^\>]+\>)', r'<img class="media-object" \1', content)
    return content

def get_content_list(tag):
    """
    Returns nested lists of posts with subheadings
    """
    result = []
    path = BASE_PATH + tag
    readme_fn = path + '/README.md'
    if os.path.exists(readme_fn):
        s = open(readme_fn).read()
        blocks = s.split('##')
        for bl in blocks:
            title = re.findall('^(.*)', bl)[0]
            # title + link
            posts = re.findall("\* \[([^\]]+)\]\(([^\)]+)\)", bl)
            if posts:
                result.append((title, posts))
    return result


def get_post(tag, slug):
    fn = BASE_PATH + tag + '/' + slug
    text = open(fn).read()
    title = re.findall(r'#+\s(.+)', text)[0]
    # fix image links
    text = re.sub(r"!\[(.*)\]\(.+\/([^\/]+)\)", f"![\g<1>](/static/content/{tag}/\g<2>)", text)
    print(text)
    content = markdown.markdown(text, extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.codehilite'])
    content = wrap_images(content)
    return title, content
