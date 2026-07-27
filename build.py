import os

from jinja2 import Environment, FileSystemLoader


env = Environment(loader=FileSystemLoader('templates'))

# (English title, filename, German title, German filename)
# German filename is None for pages with no dedicated German version
# (e.g. impressum/datenschutz are already German-only and shared).
PAGES = [
    ('Dr. Kristian Rother', 'index.html', 'Dr. Kristian Rother', 'index.html'),
    ('Courses', 'courses.html', 'Kurse', 'courses.html'),
    ('Software Engineering', 'software_engineering.html', 'Software Engineering', 'software_engineering.html'),
    ('Publications', 'publications.html', 'Publikationen', 'publications.html'),
    ('CV Dr. Kristian Rother', 'cv.html', 'Lebenslauf Dr. Kristian Rother', 'cv.html'),
    ('Testimonials', 'testimonial_list.html', 'Referenzen', 'testimonial_list.html'),
    ('Impressum', 'impressum.html', None, None),
    ('Datenschutzerklärung', 'datenschutz.html', None, None),

    ('Data Analysis with polars', 'course_polars.html', 'Datenanalyse mit polars', 'course_polars.html'),
    ('Advanced Python', 'course_advanced_python.html', 'Advanced Python', 'course_advanced_python.html'),
    ('Machine Learning', 'course_machine_learning.html', 'Machine Learning', 'course_machine_learning.html'),
    ('Docker Fundamentals', 'course_docker.html', None, None),
    ('Database Infrastructure', 'course_db_infrastructure.html', None, None),
    ('Python Unplugged', 'course_python_unplugged.html', None, None),

    ('Countdown', 'countdown.html', 'Countdown', 'countdown.html'),
    ('Check &amp; Cross', 'check_cross.html', 'Check &amp; Cross', 'check_cross.html'),
    ('Guess the Word', 'word_guess.html', 'Wort erraten', 'word_guess.html'),
    ('Flipping Letters', 'char_grid.html', 'Buchstaben-Flip', 'char_grid.html'),
    ('Card Generator', 'card_generator.html', 'Kartengenerator', 'card_generator.html'),
    ('Mood Cards', 'mood_cards.html', 'Stimmungskarten', 'mood_cards.html'),
]

os.makedirs('build/de', exist_ok=True)

# render templates
for title_en, file_en, title_de, file_de in PAGES:
    print("building", file_en)

    template = env.get_template(file_en)
    output = template.render(title=title_en, testimonial=['hello world'], lang='en',
                              en_href=file_en,
                              de_href=(f'de/{file_de}' if file_de else 'de/index.html'))
    with open(os.path.join('build', file_en), 'w') as f:
        f.write(output)

    if file_de:
        print("building de/" + file_de)
        template = env.get_template(f'de/{file_de}')
        output = template.render(title=title_de, testimonial=['hello world'], lang='de',
                                  en_href=f'../{file_en}',
                                  de_href=file_de)
        with open(os.path.join('build', 'de', file_de), 'w') as f:
            f.write(output)
