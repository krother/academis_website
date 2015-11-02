# coding: utf-8

from bottle import default_app, static_file, route, view, run
from dbhelper import get_all_posts, get_posts_by_tag, get_post, \
                     get_all_tags, get_tagname
from settings import MOD_PATH, DB_PATH, POST_PATH
import sqlite3
import os

MOD_PATH = os.path.dirname(os.path.abspath(__file__))

db = sqlite3.connect(DB_PATH)

@route('/')
@view('academis')
def index():
    return {}

@route('/posts/<slug>')
@view('blog_post')
def article_by_name(slug):
    title, content = get_post(db, slug)
    tags = get_all_tags(db)
    return {'title': title, 'text': content, 'tags': tags}

@route('/blog/tags/<tag>')
@view('article_list')
def articles_by_tag(tag):
    articles = get_posts_by_tag(db, tag)
    tags = get_all_tags(db)
    title = get_tagname(db, tag)
    return {'articles': articles, 'tags': tags, 'title': title}

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
    tags = get_all_tags(db)
    return {'articles': articles, 'tags': tags, 'title': 'All Blog Posts'}

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
    return static_file(filename, root=os.path.join(POST_PATH, 'images'))

@route('/posts/files/<filename:path>')
def static_filename(filename):
    return static_file(filename, root=os.path.join(POST_PATH, 'files'))

@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root=os.path.join(MOD_PATH, 'static'))

application = default_app()
