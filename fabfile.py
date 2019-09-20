
"""
Deploy script for Academis on PythonAnywhere
"""

#from fabric import local, lcd, cd, env
#from fabric import run
from fabric import Connection
from fabric import task

c = Connection('ssh.pythonanywhere.com', user='krother')

def deploy():
    """Load all articles to database on server"""
    with c.cd('academis'):
        c.run("git pull")

def clone_all():
    """Clones and links other repositories"""
    with cd('academis'):
        run("source clone_repos.sh")
        run("source link_images.sh")

deploy()
