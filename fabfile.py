
"""
Deploy script for Academis on PythonAnywhere
"""

from fabric.api import local, lcd, cd, env
from fabric.api import run
import os

env.hosts = ['ssh.pythonanywhere.com']

def deploy():
    """Load all articles to database on server"""
    with cd('academis'):
        run("git pull")

def rebuild():
    """Clones and links other repositories"""
    with cd('academis'):
        run("mkdir -p content")
        run("git clone https://github.com/krother/Python3_Basics_Tutorial.git")
        run("git clone https://github.com/krother/python3_grundlagenkurs.git")
        run("git clone https://github.com/krother/Python3_Reference.git")
        run("git clone https://github.com/krother/Python3_Package_Examples.git")
        run("git clone https://github.com/krother/advanced_python.git")
        run("git clone https://github.com/krother/python_testing_tutorial.git")
        run("git clone https://github.com/krother/Biopython_Tutorial.git")
        run("git clone https://github.com/krother/training_and_teaching_methods.git")
        run("git clone https://github.com/krother/speech_projects.git")
        run("mv content/Python3_Basics_Tutorial content/python_basics")
        run("mv content/python3_grundlagenkurs content/python_basics_DE")
        run("mv content/Python3_Package_Examples content/python_packages")
        run("mv content/Python3_Reference content/python_reference")
        run("mv content/python_testing_tutorial content/python_testing")
        run("mv content/Biopython_Tutorial content/biopython")
        run("mv content/training_and_teaching_methods content/teaching")

        run("mkdir -p static/content")
        run("ln -s content/biopython/images static/content/biopython")
        run("ln -s content/python_basics/images static/content/python_basics")
        run("ln -s content/python_basics_DE/images static/content/python_basics_DE")
        run("ln -s content/python_testing/images static/content/python_testing")
        run("ln -s content/teaching/images static/content/teaching")
