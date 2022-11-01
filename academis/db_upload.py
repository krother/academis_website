"""
deploys the site by SSH-tunnel-copying the content into a MySQL database.
"""
# coding: utf-8

import os
import json

import sshtunnel
from sqlalchemy import create_engine

from academis.content import MarkdownContentRepository
from academis.db_loader import initialize, clear, load_all_articles


sshtunnel.SSH_TIMEOUT = 5.0
sshtunnel.TUNNEL_TIMEOUT = 5.0

CREDENTIALS = os.path.join(os.path.split(__file__)[0], '../remote_credentials.json')
config = json.load(open(CREDENTIALS))


if __name__ == "__main__":
    with sshtunnel.SSHTunnelForwarder(
        (config['HOSTNAME']),
        ssh_username=config['SSH_USERNAME'],
        ssh_password=config['SSH_PASSWORD'],
        remote_bind_address=(config['DBCONN'], config['DB_BIND_PORT'])
    ) as tunnel:
        db = create_engine(f"mysql+pymysql://{config['DB_USERNAME']}:{config['DB_PASSWORD']}@{config['DB_HOST']}:{tunnel.local_bind_port}/{config['DBNAME']}")
        initialize(db)
        clear(db)
        n = load_all_articles(db, verbose=True)
        print(f"\n{n} articles added to remote SQL")
