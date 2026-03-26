from django.shortcuts import render
from main.models import Company
from main.dacorators import require_active_company

@require_active_company
def products(request):
    return render(request, "product/product.html")

