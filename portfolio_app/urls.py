from django.urls import path

from . import views

app_name = "portfolio"

urlpatterns = [
    path("", views.home, name="home"),
    path("message-sent/", views.home_success, name="home_success"),
]
