db:
	rm academis.sqlite3
	python academis/db_loader.py

deploy:
	scp academis.sqlite3 krother@ssh.pythonanywhere.com:academis/.

test:
	pytest --flake8 --isort

citest:
	pytest --flake8 --isort --ci
