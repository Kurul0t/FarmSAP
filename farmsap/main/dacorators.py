from django.shortcuts import redirect

def require_active_company(view_func):
    def wrapper(request, *args, **kwargs):
        company_id = request.session.get("active_company_id")
        if not company_id:
            return redirect("start_page")
        return view_func(request, *args, **kwargs)
    return wrapper