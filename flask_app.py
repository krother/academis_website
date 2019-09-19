# coding: utf-8

from flask import Flask, render_template
from testimonials import get_testimonials
from content import get_readme, get_post
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

@app.route('/posts/<tag>/<slug>')
def article_by_name(tag, slug):
    title, content = get_post(tag, slug)
    return render_template('article.html', title=title, \
           tag=tag, slug=slug, content=content, \
           testimonial=random.choice(testimonials))

@app.route('/blog/tags/<tag>')
def article_list(tag):
    title, content = get_readme(tag)
    return render_template('article.html', title=title, \
           tag=tag, slug=tag, content=content, \
           testimonial=random.choice(testimonials))

@app.route('/posts/<tag>/<slug>/<subslug>')
def article_deep(tag, slug, subslug):
    return article_by_name(tag, slug + '/' + subslug)
    #navi = [('/', 'Academis'), ('/blog', 'Blog'),
    #        ('/blog/tags/{}'.format(tag), title)]


@app.route('/testimonials')
def testimonial_list():
    return render_template('testimonial_list.html', testimonials=testimonials, testimonial=random.choice(testimonials))

@app.route('/publications')
def publications():
    return render_template('publications.html', testimonial=random.choice(testimonials))

@app.route('/impressum')
def imprint():
    return render_template('impressum.html', testimonial=random.choice(testimonials))
