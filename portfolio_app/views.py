from django.conf import settings
from django.core.mail import EmailMessage
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render

from .forms import ContactForm


def home(request):
    form = ContactForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        name = form.cleaned_data["name"]
        sender_email = form.cleaned_data["email"]
        message = form.cleaned_data["message"]

        email = EmailMessage(
            subject=f"Portfolio message from {name}",
            body=f"Name: {name}\nEmail: {sender_email}\n\nMessage:\n{message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[sender_email],
        )

        try:
            email.send(fail_silently=False)
        except Exception:
            return render(
                request,
                "portfolio_app/index.html",
                {"contact_form": form, "contact_error": True},
                status=502,
            )

        return HttpResponseRedirect(reverse("portfolio:home_success") + "#contact")

    return render(request, "portfolio_app/index.html", {"contact_form": form})


def home_success(request):
    return render(
        request,
        "portfolio_app/index.html",
        {"contact_form": ContactForm(), "contact_success": True},
    )
