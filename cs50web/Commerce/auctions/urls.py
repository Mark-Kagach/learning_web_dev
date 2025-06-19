from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # any variable?
    path("listing/<int:listing_id>/", views.listing, name="listing"),

    # should this have user_id as a passing variable?
    path("create", views.create, name="create"),

    # user_id?
    path("watchlist", views.watchlist, name="watchlist"),

    path("categories/<str:category>/", views.categories, name="categories")

]
