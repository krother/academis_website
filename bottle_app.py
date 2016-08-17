# coding: utf-8

from bottle import default_app, static_file, route, view
from dbhelper import get_all_posts, get_posts_by_tag, get_post, \
                     get_all_tags, get_tagname 
from testimonials import get_testimonials
from rss_feed import get_feed
from settings import MOD_PATH, DB_PATH, POST_PATH
import sqlite3
import os
import random

db = sqlite3.connect(DB_PATH)
testimonials = get_testimonials()

TOC = ['Python', 'Data Analysis', 'Presenting',
       'Leadership', 'Project Management',
       'Teaching']
       # , 'Writing', 'Time Management', 
ALL_TAGS = get_all_tags(db, min_number=3, exclude=TOC)


@route('/')
@view('academis')
def index():
    navi = [('/', 'Academis')]
    return {'tags': ALL_TAGS, 'testimonial': random.choice(testimonials),
            'navi': navi}


@route('/posts/<slug>')
@view('blog_post')
def article_by_name(slug):
    title, content = get_post(db, slug)
    navi = [('/', 'Academis'), ('/blog', 'Blog'),
            ('/posts/{}'.format(slug), title)]
    return {'title': title, 'text': content, 'tags': ALL_TAGS, 'navi': navi}


@route('/blog/tags/<tag>')
@view('article_list')
def articles_by_tag(tag):
    articles = get_posts_by_tag(db, tag)
    title = get_tagname(db, tag)
    navi = [('/', 'Academis'), ('/blog', 'Blog'),
            ('/blog/tags/{}'.format(tag), title)]
    return {'articles': articles, 'tags': ALL_TAGS,
            'title': title, 'navi': navi}


@route('/blog')
@view('article_list')
def all_posts():
    articles = get_all_posts(db)
    navi = [('/', 'Academis'), ('/blog', 'Blog')]
    return {'articles': articles, 'tags': ALL_TAGS,
            'title': 'All Blog Posts', 'navi': navi}


@route('/blog_list')
def article_list():
    return all_posts()


@route('/rss')
def rss_feed():
    return get_feed(db)


@route('/talks')
@view('talks')
def talks():
    navi = [('/', 'Academis'), ('/talks', 'Talks')]
    return {'tags': ALL_TAGS, 'navi': navi}


@route('/courses')
@view('courses')
def courses():
    navi = [('/', 'Academis'), ('/courses', 'Courses')]
    return {'tags': ALL_TAGS, 'navi': navi}


@route('/testimonials')
@view('testimonial_list')
def testimonial_list():
    navi = [('/', 'Academis'), ('/testimonials', 'Testimonials')]
    return {'tags': ALL_TAGS, 'testimonials': testimonials,
            'navi': navi}


@route('/publications')
@view('publications')
def publications():
    navi = [('/', 'Academis'), ('/publications', 'Publications')]
    return {'tags': ALL_TAGS, 'navi': navi}


@route('/contact')
@view('contact')
def contact():
    navi = [('/', 'Academis'), ('/contact', 'Contact')]
    return {'tags': ALL_TAGS, 'navi': navi}


@route('/impressum')
@view('impressum')
def imprint():
    navi = [('/', 'Academis'), ('/impressum', 'Imprint')]
    return {'tags': ALL_TAGS, 'navi': navi}

@route('/area_c2')
@view('tm_area')
def area_c2():
    """Placeholder for TM page"""
    title, content = get_post(db, 'area_c2_training')
    return {'text': content}


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
