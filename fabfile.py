
"""
Deploy script for Academis on PythonAnywhere
"""

from fabric.api import local, lcd, cd, env
from fabric.api import run
import os

env.hosts = ['ssh.pythonanywhere.com']

def test_local():
    with lcd("tests"):
        local("python test_all.py")

def test_remote():
    with lcd("tests"):
        local("python test_all.py remote")

def prepare():
    with lcd("academis"):
        local("hg ci -u krother")
        local("hg push")

def backup():
    run('mysqldump -u %s -p=%s %s > backup.sql' % (
    	'krother', 'bDOtxgnI', 'krother_academis'))

def deploy():
    with cd('academis_bottle'):
        run("git pull")
    # run("init/academis restart")
