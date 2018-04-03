from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView


class RegistrationView(TemplateView):
    """
    View class to perform user registration.
    """
    template_name = 'users/register.html'
    form_class = UserCreationForm
    initial = {}

    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        """
        Checks username and password to be free and valid, than registers
        new user.
        """
        form = self.form_class(request.POST)

        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/auth/login/')
        else:
            messages.error(request, form.errors)
            return HttpResponseRedirect('/auth/register')
