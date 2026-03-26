# finance/context_processors.py
from decimal import Decimal
from django.db.models import Sum
from .models import Transactions

def finance_summary(request):
    company_id = request.session.get("active_company_id")
    if not company_id:
        return {}

    qs = Transactions.objects.filter(company_id=company_id)

    income_sum = qs.filter(type="income").aggregate(s=Sum("suma"))["s"] or Decimal("0")
    expense_sum = qs.filter(type="expense").aggregate(s=Sum("suma"))["s"] or Decimal("0")
    total = income_sum - expense_sum

    return {
        "finance_total": total,
        "finance_income": income_sum,
        "finance_expense": expense_sum,
    }