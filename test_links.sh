
wget -r -l0 -t 3 http://localhost:5000 2> sitemap.txt
python parse_map.py
# pytest test_flask_app.py
