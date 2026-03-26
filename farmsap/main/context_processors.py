from main.models import Company

def active_company(request):
    company = None
    company_id = request.session.get("active_company_id")

    if company_id:
        company = Company.objects.filter(id=company_id).first()

    return {
        "company": company
    }