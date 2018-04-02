from rest_framework import serializers

from . import models


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    """

    class Meta:
        model = models.Product
        fields = (
            'id',
            'name',
            'amount',
            'order',
        )

    def create(self, validated_data):
        """
        Adds 'product_list' field to created Product.
        """
        validated_data[u'product_list'] = self.context['request'].user.productlist
        return super(ProductSerializer, self).create(validated_data)
