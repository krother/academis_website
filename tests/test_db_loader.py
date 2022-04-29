
import os
import pytest
import sqlite3

from academis.db_loader import (
    initialize,
    load_all_articles
)


@pytest.fixture
def temp_db():
    fn = 'dummy.sqlite3'
    db = sqlite3.connect(fn)
    initialize(db)
    yield db
    db.close()
    os.remove(fn)


def test_load_db(temp_db):
    load_all_articles(temp_db)
    result = list(temp_db.execute("SELECT count(*) FROM article"))
    assert result[0][0] > 100
