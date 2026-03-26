from django.shortcuts import render
from product.models import Product
from main.models import Company
from .models import Order
from main.dacorators import require_active_company

@require_active_company
def orders(request):
    products = Product.objects.all().filter(company_id=request.session["active_company_id"])
    orders=Order.objects.all().filter(company_id=request.session["active_company_id"]).order_by("created_at")
    
    return render(request, "order/order.html",{
        "orders": orders,
        "products": products,
        "statuses": Order.STATUS_CHOICES,
    })