# coding: utf-8

import sqlite3
from dbhelper import DB_PATH
from bottle_app import CONTENT_PATH

db = sqlite3.connect(DB_PATH)

with db:
    db.executescript('DELETE FROM posts')
    db.executescript('DELETE FROM tags')

    for line in open(CONTENT_PATH + 'titles.txt'):
        col = line.strip().split('\t')
        if len(col) == 2:
            filename, title = col
            filename = filename.replace('.md', '')
            query = 'INSERT INTO posts VALUES (?,?)'
            db.execute(query, (filename, title))
            print ('added', title)
        else:
            print('invalid format', col)

    for line in open(CONTENT_PATH + 'tags.txt'):
        col = line.strip().split('\t')
        if len(col) == 2:
            filename, tags = col
            filename = filename.replace('.md', '')
            tags = tags.split(',')
            for t in tags:
                t = t.strip().lower().replace(' ', '-')
                query = 'INSERT INTO tags VALUES (?,?)'
                db.execute(query, (t, filename))
                print ('added', t, 'to', filename)
        else:
            print('invalid format', col)

        