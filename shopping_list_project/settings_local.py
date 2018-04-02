"""
Contains settings, specific for current host machine.
For example, database connection settings.
"""


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'shopping_list',
        'USER': 'test_user',
        'PASSWORD': '125478',
        'HOST': '127.0.0.1',
        'PORT': '',
    }
}
