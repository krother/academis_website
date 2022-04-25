FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt /app

RUN apt-get update && \
    apt-get install -y git
 
RUN pip install -r requirements.txt --no-cache-dir

COPY dev_requirements.txt /app
RUN pip install -r dev_requirements.txt --no-cache-dir

# clone 1 example repo
RUN mkdir -p content
RUN mkdir -p static/content
RUN git clone https://github.com/krother/Python3_Basics_Tutorial.git
RUN mv Python3_Basics_Tutorial content/python_basics
RUN cp -r content/python_basics/images static/content/python_basics

# install flask app locally
ADD . /app
RUN python setup.py install

ENV FLASK_APP=academis/flask_app.py
ENV FLASK_DEBUG=TRUE

#CMD ["flask", "run"]
CMD ["gunicorn", "-b", "0.0.0.0:5000", "-e", "FLASK_DEBUG=TRUE", "academis.flask_app:app"]
