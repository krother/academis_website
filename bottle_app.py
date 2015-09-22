# coding: utf-8

from bottle import default_app, static_file, route, view, run
import os

MOD_PATH = os.path.dirname(os.path.abspath(__file__))
 
@route('/')
@view('academis')
def index():
    return {}


@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root=os.path.join(MOD_PATH, 'static'))

application = default_app()
# run(app, host='localhost', port=8080, reloader=True)
