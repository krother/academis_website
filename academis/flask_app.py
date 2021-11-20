# coding: utf-8

from flask import Flask, render_template
from academis.testimonials import get_testimonials
from academis.content import get_readme, get_post
import random
import os

BASE_PATH = os.path.join(os.path.split(__file__)[0], '..')


app = Flask(__name__, root_path=BASE_PATH)

testimonials = get_testimonials()


@app.route('/')
def index():
    return render_template('academis.html', testimonial=random.choice(testimonials))

@app.route('/cv')
def cv():
    navi = [('/', 'Academis')]
    return render_template('cv.html', testimonial=random.choice(testimonials))

@app.route('/posts/<tag>/<path:slug>')
def article_by_name(tag, slug):
    title, content = get_post(tag, slug)
    return render_template('article.html', title=title, \
           tag=tag, slug=slug, content=content, \
           testimonial=random.choice(testimonials))

@app.route('/blog/tags/<tag>')
def article_list(tag):
    """legacy URL - kept for external links"""
    title, content = get_readme(tag)
    return render_template('article.html', title=title, \
           tag=tag, slug=tag, content=content, \
           testimonial=random.choice(testimonials))

@app.route('/testimonials')
def testimonial_list():
    return render_template('testimonial_list.html', testimonials=testimonials, testimonial=random.choice(testimonials))

@app.route('/publications')
def publications():
    return render_template('publications.html', testimonial=random.choice(testimonials))

@app.route('/impressum')
def imprint():
    return render_template('impressum.html', testimonial=random.choice(testimonials))


@app.route('/<tag>')
def tag_direct(tag):
    return article_list(tag)
