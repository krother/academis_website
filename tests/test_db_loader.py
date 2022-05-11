
import os
import sqlite3

import pytest
from testconf import TEST_DATA_PATH

from academis.db_loader import initialize, insert_file, load_all_articles


@pytest.fixture
def temp_db():
    fn = 'dummy.sqlite3'
    db = sqlite3.connect(fn)
    initialize(db)
    yield db
    db.close()
    os.remove(fn)


@pytest.mark.no_ci
def test_load_db(temp_db):
    load_all_articles(temp_db)
    result = list(temp_db.execute("SELECT count(*) FROM article"))
    assert result[0][0] > 100
    result = list(temp_db.execute("SELECT count(*) FROM file"))
    assert result[0][0] > 50


def test_insert_file(temp_db):
    result = list(temp_db.execute("SELECT * FROM file"))
    assert len(result) == 0

    fn = TEST_DATA_PATH + '/brain.png'
    data = open(fn, 'rb').read()
    insert_file(temp_db, 'test', fn, data)

    result = list(temp_db.execute("SELECT tag, slug, data FROM file"))
    assert len(result) == 1
    tag, name, data = result[0]
    assert tag == 'test'
    assert name.endswith('brain.png')
    assert len(data) > 200
