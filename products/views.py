import json

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from products.models import Product, ProductList
from products.serializers import ProductSerializer


class MainPage(TemplateView):
    """
    Renders main page with shopping list.
    """

    def get(self, request):
        if request.user.is_authenticated:
            return render(request, 'products/main.html', context={})
        else:
            return HttpResponseRedirect('/auth/login')


class ProductViewSet(ModelViewSet):
    """
    API endpoint for Product model.
    """
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    serializer_class = ProductSerializer
    allowed_methods =  ['get', 'post', 'patch', 'delete']
    #http_method_names = ['get', 'post', 'patch', 'put', 'delete']

    def get_queryset(self):
        """
        Returns only products, which belong to current user's ProductList.
        """
        user = self.request.user
        product_list = ProductList.objects.filter(user__exact=user)
        return Product.objects.filter(product_list__exact=product_list)

    @list_route(methods=['patch'])
    def set_order(self, request, *args, **kwargs):
        body = json.loads(request.body)
        product_list = request.user.productlist

        for update_data in body:
            product = Product.objects.get(id__exact=update_data['id'], product_list__exact=product_list)
            product.order = update_data['order']
            product.save()

        return Response('OK')

