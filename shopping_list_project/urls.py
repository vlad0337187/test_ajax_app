"""shopping_list_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.conf.urls import url, include
from rest_framework import routers

import products.views  as products
import users.views as users
from . import views as general

router = routers.DefaultRouter()
router.register(r'products', products.ProductViewSet, 'products')


urlpatterns = [
    url('^$', general.RedirectMain.as_view()),

    url('^auth/register/$', users.RegistrationView.as_view(template_name='users/register.html')),
    url('^auth/login/$', auth_views.LoginView.as_view(template_name='users/login.html')),
    url('^auth/logout/$', auth_views.LogoutView.as_view(template_name='users/logged_out.html')),

    url('^products/main/$', products.MainPage.as_view()),

    url('^api/v1/', include(router.urls)),

    url('^admin/', admin.site.urls),
]

