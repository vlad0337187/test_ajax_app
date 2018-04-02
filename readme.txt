Installation and launch:

1. Install Python 2.7
2. Install Pip (if it was not bundled with Python)
3. Install Pipenv: 'pip install pipenv'
4. Open terminal, make directory, where this file is placed, current working directory 'cd /.../shopping_list/'
5. Install project dependencies: 'pipenv install'
6. Specify your database configuration in './shopping_list_project/settings_local.py'
6. Launch virtualenv shell: 'pipenv shell'
7. Install initial data from fixtures:
    ./manage.py loaddata initial_users
	./manage.py loaddata initial_products
7. Launch Django's development server: './manage.py runserver'
8. Open http://127.0.0.1:8000/ in browser
