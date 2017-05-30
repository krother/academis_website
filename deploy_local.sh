#!/usr/bin/bash

cd ../academis/posts/time_management
git pull
cp images/* ../images/

cd ../grants
git pull
cp images/* ../images/

cd ../writing
git pull
cp images/* ../images/

cd ../teaching
git pull
cp images/* ../images

cd ../../../academis_bottle

python3 add_posts.py
