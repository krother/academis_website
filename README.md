# Academis Website

(c) 2022 Dr. Kristian Rother

Distributed under the conditions of the Creative Commons Attribution Share-alike License 4.0.


## Start locally

1. install Python 3
2. `pip install -r requirements.txt`
3. `./run_local.sh`

## Start locally with Docker

    docker build -t academis .
    docker run -p 5000:5000 -d --name aca academis

To remove the old container before restart:

    docker stop aca
    docker rm aca
