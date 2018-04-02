from rest_framework import permissions as p


class ProductPermission(p.BasePermission):
    """
    Checks permissions for accessing Permission model.
    """

    def has_permission(self, request, view):
        """
        Any logged in users can use ProductList model.
        """
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Checks, does user owns this product list, or not.
        """
        return obj.user == request.user


class ProductListPermission(p.BasePermission):
    """
    Checks permissions for accessing ProductList model.
    """

    def has_permission(self, request, view):
        """
        Any logged in users can use ProductList model.
        """
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Checks, does user owns this product list, or not.
        """
        return obj.user == request.user
