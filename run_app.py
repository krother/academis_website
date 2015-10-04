#!/usr/bin/env python3

from bottle import run
from bottle_app import application

run(application, host='localhost', port=8080, reloader=True)