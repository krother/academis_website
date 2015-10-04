# coding: utf-8

from bottle import default_app, static_file, route, view, run
from dbhelper import DB_PATH, get_all_posts, get_posts_by_tag, get_post, get_all_tags
import sqlite3
import os
import markdown

MOD_PATH = os.path.dirname(os.path.abspath(__file__))
CONTENT_PATH = '/home/krother/Desktop/academis_content/'
ARTICLE_PATH = CONTENT_PATH + 'posts'
PAGE_PATH = CONTENT_PATH + 'pages'

db = sqlite3.connect(DB_PATH)

@route('/')
@view('academis')
def index():
    return {}

@route('/pages/<name>')
@view('article')
def article_by_name(name):
    article = open(PAGE_PATH + os.sep + name + '.md').read()
    html = markdown.markdown(article)
    return {'text': html}

@route('/posts/<name>')
@view('article')
def article_by_name(name):
    article = open(ARTICLE_PATH + os.sep + name + '.md').read()
    html = markdown.markdown(article)
    return {'text': html}

@route('/blog/tags/<tag>')
@view('article_list')
def articles_by_tag(tag):
    articles = get_posts_by_tag(db, tag)
    return {'articles': articles}

@route('/blog')
@view('blog')
def article_list():
    articles = get_all_posts(db)
    tags = get_all_tags(db)
    return {'articles': articles, 'tags': tags}

@route('/blog_list')
@view('article_list')
def article_list():
    articles = get_all_posts(db)
    return {'articles': articles}

@route('/talks')
@view('talks')
def courses():
    return {}

@route('/courses')
@view('courses')
def courses():
    return {}

@route('/publications')
@view('publications')
def publications():
    return {}

@route('/contact')
@view('contact')
def imprint():
    return {}

@route('/impressum')
@view('impressum')
def imprint():
    return {}

@route('/posts/images/<filename:path>')
def static_image(filename):
    return static_file(filename, root=os.path.join(ARTICLE_PATH, 'images'))

@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root=os.path.join(MOD_PATH, 'static'))

application = default_app()
