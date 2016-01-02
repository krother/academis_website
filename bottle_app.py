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

TOC = ['Python', 'Data Analysis', 'Writing', 'Presenting', \
       'Time Management', 'Leadership', 'Project Management', \
       'Teaching']
ALL_TAGS = get_all_tags(db, min_number=3, exclude=TOC)

@route('/')
@view('academis')
def index():
    return {'tags': ALL_TAGS, 'testimonial':random.choice(testimonials)}

@route('/posts/<slug>')
@view('blog_post')
def article_by_name(slug):
    title, content = get_post(db, slug)
    return {'title': title, 'text': content, 'tags': ALL_TAGS}

@route('/blog/tags/<tag>')
@view('article_list')
def articles_by_tag(tag):
    articles = get_posts_by_tag(db, tag)
    title = get_tagname(db, tag)
    return {'articles': articles, 'tags': ALL_TAGS, 'title': title}

@route('/blog')
@view('article_list')
def all_posts():
    articles = get_all_posts(db)
    return {'articles': articles, 'tags': ALL_TAGS, 'title': 'All Blog Posts'}

@route('/blog_list')
def article_list():
    return all_posts()

@route('/talks')
@view('talks')
def courses():
    return {'tags': ALL_TAGS}

@route('/courses')
@view('courses')
def courses():
    return {'tags': ALL_TAGS}

@route('/publications')
@view('publications')
def publications():
    return {'tags': ALL_TAGS}

@route('/contact')
@view('contact')
def imprint():
    return {'tags': ALL_TAGS}

@route('/impressum')
@view('impressum')
def imprint():
    return {'tags': ALL_TAGS}

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
