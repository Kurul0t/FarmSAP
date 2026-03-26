from django.shortcuts import render
from django.db.models import Sum
from decimal import Decimal
from collections import defaultdict


from .services import get_finance_summary
from main.dacorators import require_active_company
from .models import Transactions




@require_active_company
def transactions(request):
    
    qs = Transactions.objects.all().filter(company_id=request.session["active_company_id"]).order_by("-date", "-id")

    summary = get_finance_summary(request.session["active_company_id"])

    months_map = defaultdict(list)
    for t in qs:
        key = (t.date.year, t.date.month)
        months_map[key].append(t)

    months = []
    sorted_keys = sorted(months_map.keys(), reverse=True)

    for year, month in sorted_keys:
        items = months_map[(year, month)]

        month_income = sum(i.suma for i in items if i.type == "income") or Decimal("0")
        month_expense = sum(i.suma for i in items if i.type == "expense") or Decimal("0")
        month_total = month_income - month_expense

        days_map = defaultdict(list)
        for i in items:
            days_map[i.date].append(i)

        days = []
        for day_date in sorted(days_map.keys(), reverse=True):
            day_items = days_map[day_date]
            day_plus = sum(i.suma for i in day_items if i.type == "income") or Decimal("0")
            day_minus = sum(i.suma for i in day_items if i.type == "expense") or Decimal("0")

            days.append({
                "date": day_date,
                "items": day_items,
                "plus": day_plus,
                "minus": day_minus,
            })

        month_label = items[0].date.strftime("%B %Y") if items else f"{year}-{month}"

        months.append({
            "year": year,
            "month": month,
            "label": month_label,
            "income": month_income,
            "expense": month_expense,
            "total": month_total,
            "days": days,
        })
    
    return render(request, 'finance/transactions.html', {
        "months": months,
        "total": summary["total"],
        "income_sum": summary["income_sum"],
        "expense_sum": summary["expense_sum"],
    })