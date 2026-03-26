from django.urls import include, path
from . import views

urlpatterns = [
    path("",views.start_page, name="start_page"),
    path("infopage/", views.infopage, name="infopage"),
    path("orders/", include("order.urls")),
    
]