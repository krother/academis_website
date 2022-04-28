# coding: utf-8

from flask import Flask, render_template
from academis.testimonials import get_random_testimonial, get_all_testimonials
from academis.content import get_article_list_html, get_article_html
import os

BASE_PATH = os.path.join(os.path.split(__file__)[0], "..")


app = Flask(__name__, root_path=BASE_PATH)


@app.route("/")
def index():
    return render_template("academis.html", testimonial=get_random_testimonial())


@app.route("/cv")
def cv():
    return render_template("cv.html", testimonial=get_random_testimonial())


@app.route("/posts/<tag>/<path:slug>")
def article_by_name(tag, slug):
    article = get_article_html(tag, slug)
    return render_template(
        "article.html",
        title=article.title,
        tag=tag,
        slug=slug,
        content=article.text,
        testimonial=get_random_testimonial(),
    )


@app.route("/blog/tags/<tag>")
def article_list(tag):
    """legacy URL - kept for external links"""
    article = get_article_list_html(tag)
    return render_template(
        "article.html",
        title=article.title,
        tag=tag,
        slug=tag,
        content=article.text,
        testimonial=get_random_testimonial(),
    )


@app.route("/testimonials")
def testimonial_list():
    return render_template(
        "testimonial_list.html",
        testimonials=get_all_testimonials(),
        testimonial=get_random_testimonial(),
    )


@app.route("/publications")
def publications():
    return render_template("publications.html", testimonial=get_random_testimonial())


@app.route("/impressum")
def imprint():
    return render_template("impressum.html", testimonial=get_random_testimonial())


@app.route("/<tag>")
def tag_direct(tag):
    return article_list(tag)
