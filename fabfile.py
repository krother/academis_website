
"""
Deploy script for Academis on PythonAnywhere
"""

from fabric.api import local, lcd, cd, env
from fabric.api import run
import os

env.hosts = ['ssh.pythonanywhere.com']

def deploy():
    with cd('academis'):
        run("git pull")
    with cd('academis_bottle'):
        run("python3 add_posts.py")

def rebuild():
    with cd('academis_bottle'):
        run("git pull")
        run("rm academis.db")
        run("python3 dbhelper.py")
    deploy()
    print("PLEASE RESTART WEB SERVICE MANUALLY!")
