from decimal import Decimal
from django.db.models import Sum
from .models import Transactions


def get_finance_summary(company):
    
    qs = Transactions.objects.all().filter(company_id=company).order_by("-date", "-id")
    
    income_sum = qs.filter(type="income").aggregate(s=Sum("suma"))["s"] or Decimal("0")
    expense_sum = qs.filter(type="expense").aggregate(s=Sum("suma"))["s"] or Decimal("0")
    total = income_sum - expense_sum
    
    return {
        "income_sum": income_sum,
        "expense_sum": expense_sum,
        "total": total,
    }