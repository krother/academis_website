# coding: utf-8

from flask import Flask, render_template
from testimonials import get_testimonials
import os
import random

app = Flask(__name__)

testimonials = get_testimonials()

TOC = ['Python Best Practices',
       'Python Basics',
       'Python',
       'Data Analysis',
       'Presenting',
       'Teaching',
       'Leadership',
       ]


@app.route('/')
def index():
    navi = [('/', 'Academis')]
    return render_template('academis.html', testimonial=random.choice(testimonials))

@app.route('/cv')
def cv():
    navi = [('/', 'Academis')]
    return render_template('cv.html', testimonial=random.choice(testimonials))

@app.route('/posts/<slug>')
#@view('blog_post')
def article_by_name(slug):
    title, content, license = get_post(db, slug)
    navi = [('/', 'Academis'), ('/blog', 'Blog'),
            ('/posts/{}'.format(slug), title)]
    return {'title': title, 'text': content, 'navi': navi, 'license': license}


@app.route('/blog/tags/<tag>')
#@view('article_list')
def articles_by_tag(tag):
    articles = get_posts_by_tag(db, tag)
    title = get_tagname(db, tag)
    navi = [('/', 'Academis'), ('/blog', 'Blog'),
            ('/blog/tags/{}'.format(tag), title)]
    return {'articles': articles, 'tags': ALL_TAGS,
            'title': title, 'navi': navi}


@app.route('/blog')
#@view('article_list')
def all_posts():
    articles = get_all_posts(db)
    navi = [('/', 'Academis'), ('/blog', 'Blog')]
    return {'articles': articles, 'tags': ALL_TAGS,
            'title': 'All Blog Posts', 'navi': navi}


@app.route('/blog_list')
def article_list():
    return all_posts()

@app.route('/testimonials')
def testimonial_list():
    return render_template('testimonial_list.html', testimonials=testimonials, testimonial=random.choice(testimonials))

@app.route('/publications')
def publications():
    return render_template('publications.html', testimonial=random.choice(testimonials))

@app.route('/impressum')
def imprint():
    return render_template('impressum.html', testimonial=random.choice(testimonials))
