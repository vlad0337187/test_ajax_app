from django.contrib.auth.models import User
import django.contrib.postgres.fields as p_fields
from django.db import models


class ProductList(models.Model):
    """
    List of products, owned by some user.
    Fields:
        'products' - list of product id's of current user.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Product(models.Model):
    """
    Product, which will appear in the list of products.
    """
    product_list = models.ForeignKey(ProductList, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    amount = models.FloatField()
    order = models.IntegerField(default=0)
