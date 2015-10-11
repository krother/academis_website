# coding: utf-8

import sqlite3
from dbhelper import DB_PATH
from settings import CONTENT_PATH, POST_PATH, PAGE_PATH
import markdown
import os


def slugify(s):
    s = s.strip().lower()
    s = s.replace('.md', '')
    s = s.replace('.html', '')
    s = s.replace(' ', '_')
    return s

def add_post(db, filename, title):
    fn = os.path.join(POST_PATH, filename)
    slug = slugify(filename)
    content = open(fn).read()
    if filename.endswith('.md'):
        content = markdown.markdown(content, extensions=['markdown.extensions.tables'])
    if filename.endswith('.html'):
        mdfn = fn.replace('.html', '.md')
        if os.path.exists(mdfn):
            return 0
    query = 'INSERT INTO posts VALUES (?,?,?)'
    db.execute(query, (slug, title, content))
    #print ('added post', slug, filename, title)
    return 1

def add_tag(db, tag, post):
    slug = slugify(tag)
    query = 'INSERT INTO tags VALUES (?,?,?)'
    db.execute(query, (slug, tag, post))
    #print ('added tag', t, 'to', post)
    return 1


db = sqlite3.connect(DB_PATH)

with db:
    db.executescript('DELETE FROM posts')
    db.executescript('DELETE FROM tags')

    n = 0
    nposts = 0
    ntags = 0
    for line in open(CONTENT_PATH + 'titles.txt'):
        n += 1
        col = line.strip().split('\t')
        if len(col) == 5:
            filename, title, published, timestamp, tags = col
            if published == 'Y':
                nposts += add_post(db, filename, title)
                post = slugify(filename)
                for t in tags.split(','):
                    ntags += add_tag(db, t.strip(), post)
            else:
                print('not published: ' + filename)
        else:
            print('invalid format', col)

print('files processed: %i' % n)
print('posts added: %i' % nposts)
print('tag entries added: %i' % ntags)