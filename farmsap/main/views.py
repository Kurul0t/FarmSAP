from django.shortcuts import render, redirect
from .models import Company
from order.models import Order
from client.models import Client
from main.dacorators import require_active_company
from django.utils import timezone

def start_page(request):
    company=Company.objects.all()
    if request.method == "POST":
        company_id = request.POST.get("company_id")
        if company_id:
            request.session["active_company_id"] = int(company_id)
            return redirect("infopage")
    return render(request, "main/start_page.html", {"companies": company})

@require_active_company
def infopage(request):
    order = Order.objects.filter(
        company_id=request.session["active_company_id"]
        )
    
    now = timezone.now()
    
    clients = Client.objects.filter(company_id=request.session["active_company_id"])

    client_count = clients.count()
    client_count_mnth = clients.filter(
        created_at__year=now.year,
        created_at__month=now.month 
    ).count()
    
    
    return render(request, "main/infopage.html",{
        "orders_count": order.count(),
        "orders":order.order_by("created_at"),
        "client_count": client_count,
        "client_count_mnth":client_count_mnth,
    })

