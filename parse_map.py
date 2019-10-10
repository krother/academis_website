
import re

s = open('sitemap.txt').read()
pars = s.split('\n--')
result = {}

for p in pars:
    url = re.findall('http://localhost:5000(.+)', p)[0]
    status = re.findall('awaiting response... (\d+)', p)
    status = status[0] if status else '???'
    result[url] = status

for r in result:
    if result[r] != '200':
        print(r, result[r])
