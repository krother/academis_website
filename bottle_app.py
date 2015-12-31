# coding: utf-8

from bottle import default_app, static_file, route, view, run
from dbhelper import get_all_posts, get_posts_by_tag, get_post, \
                     get_all_tags, get_tagname 
from testimonials import get_testimonials
from settings import MOD_PATH, DB_PATH, POST_PATH
import sqlite3
import os
import random
MOD_PATH = os.path.dirname(os.path.abspath(__file__))

db = sqlite3.connect(DB_PATH)
testimonials = get_testimonials()

@route('/')
@view('academis')
def index():
    return {'tags': get_all_tags(db), 'testimonial':random.choice(testimonials)}

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
@view('article_list')
def all_posts():
    articles = get_all_posts(db)
    tags = get_all_tags(db)
    return {'articles': articles, 'tags': tags, 'title': 'All Blog Posts'}

@route('/blog_list')
def article_list():
    return all_posts()

@route('/talks')
@view('talks')
def courses():
    return {'tags': get_all_tags(db)}

@route('/courses')
@view('courses')
def courses():
    return {'tags': get_all_tags(db)}

@route('/publications')
@view('publications')
def publications():
    return {'tags': get_all_tags(db)}

@route('/contact')
@view('contact')
def imprint():
    return {'tags': get_all_tags(db)}

@route('/impressum')
@view('impressum')
def imprint():
    return {'tags': get_all_tags(db)}

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
