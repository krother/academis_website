
import os
import re
import markdown

BASE_PATH = os.path.split(__file__)[0] + '/content/'

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
    content = markdown.markdown(text, extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.codehilite'])
    return 'foo', content
