
from feedgen.feed import FeedGenerator
from dbhelper import get_all_posts, get_post
from settings import DB_PATH
import sqlite3


def get_feed(db):
    fg = FeedGenerator()
    fg.id('http://www.academis.eu/feed')
    fg.title('Academis Blog')
    fg.author( {'name':'Kristian Rother','email':'krother@academis.eu'} )
    fg.link( href='http://www.academis.eu', rel='alternate' )
    fg.logo('http://www.academis.eu/static/images/academis_kr350.png')
    fg.subtitle('Articles on Python programming, Data analysis and Leadership in tech')
    fg.link( href='http://www.academis.eu/academis.atom', rel='self' )
    fg.language('en')
    fg.contributor( name='Kristian Rother', email='krother@academis.eu' )

    for title, slug in get_all_posts(db):
        title, content = get_post(db, slug)
        fe = fg.add_entry()
        fe.id('http://www.academis.eu/posts/{}'.format(slug))
        fe.link(href='http://www.academis.eu/posts/{}'.format(slug))
        fe.title(title)
        fe.description(content[:300])

    rssfeed  = fg.rss_str(pretty=True)
    fg.rss_file('rss.xml') # Write the RSS feed to a file
    return rssfeed

    # atomfeed = fg.atom_str(pretty=True) # Get the ATOM feed as string
    # fg.atom_file('atom.xml') # Write the ATOM feed to a file

if __name__ == '__main__':
    db = sqlite3.connect(DB_PATH)
    rssfeed = get_feed(db)
    print(rssfeed)
