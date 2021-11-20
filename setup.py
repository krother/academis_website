
from setuptools import setup
import os

def open_file(fname):
   return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
   name="academis_website",
   version="1.0.0",
   description="Flask app that powers www.academis.eu",
   long_description=open_file("README.md"),
   author="Spiced Academy",
   author_email="kristian@spiced-academy.com",
   packages=["academis"],
   url="https://www.academis.eu",
   license="MIT",
   classifiers=[
      "Programming Language :: Python :: 3.8",
   ]
)
