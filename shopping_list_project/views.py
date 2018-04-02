from django.http import HttpResponseRedirect
from django.views.generic import TemplateView


class RedirectMain(TemplateView):
    """
    Redirects to tests or login page, depending on: was user logged in or not.
    """

    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect('/products/main')
        return HttpResponseRedirect('/auth/login')
