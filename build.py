
import os

from jinja2 import Environment, FileSystemLoader


env = Environment(loader=FileSystemLoader('templates'))

PAGES = [
    ('Dr. Kristian Rother', 'index.html'),
    ('Publications', 'publications.html'),
    ('CV Dr. Kristian Rother', 'cv.html'),
    #('Videos', 'videos.html'),
    ('Testimonials', 'testimonial_list.html'),
    ('Impressum', 'impressum.html'),
]

# render templates
for title, filename in PAGES:
    print("building", filename)
    template = env.get_template(filename)
    output = template.render(title=title, testimonial=['hello world'])
    with open(os.path.join('build', filename), 'w') as f:
        f.write(output)
