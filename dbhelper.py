# coding: utf-8

import sqlite3

DB_PATH = 'academis.db'

DB_SETUP = '''

CREATE TABLE IF NOT EXISTS posts (
    filename VARCHAR(32),
    title VARCHAR(250)
); 

CREATE TABLE IF NOT EXISTS tags (
    tag VARCHAR(32),
    filename VARCHAR(32)
);

CREATE UNIQUE INDEX i1 ON posts(filename);

'''

def initialize_database(path):
    db = sqlite3.connect(path)
    connection.executescript(DB_SETUP)
    db.close()

def get_post(connection, name):
    query = '''SELECT title FROM posts WHERE filename=%s''' % name
    result = connection.execute(query)
    if result:
        return result[0]

def get_all_posts(connection):
    query = '''SELECT title, filename FROM posts'''
    result = connection.execute(query)
    return list(result)

def get_all_tags(connection):
    query = '''SELECT tag FROM tags GROUP BY tag ORDER BY tag'''
    result = connection.execute(query)
    return [r[0] for r in result]

def get_posts_by_tag(connection, tag):
    query = '''SELECT p.title, p.filename FROM tags t INNER JOIN posts p ON t.filename=p.filename WHERE t.tag="%s"''' % tag
    result = connection.execute(query)
    return list(result)



if __name__ == '__main__':
    initialize_database(DB_PATH)
