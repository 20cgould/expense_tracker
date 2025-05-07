from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Expense, Budget
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import HttpResponse
from django.forms.models import model_to_dict



# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)
@login_required
def new_expense(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        user = request.user
        amount = data['amount']
        description = data['description']
        date = data['date']
        name = data['name']
        is_income = data.get('is_income', False)
        is_deduction = data.get('is_deduction', False)
        # Validate the data

        # Save the expense to the database
        expense = Expense(user=user, amount=amount, description=description, date=date, name=name)
        expense.save()

        return JsonResponse({'status': 'success', 'message': 'Expense added successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@login_required
def new_budget(request):
    if request.method == 'POST':
        budget = json.loads(request.body)
        budget = Budget(amount=budget['budget'], user=request.user)
        budget.save()

        return JsonResponse({'status': 'success', 'message': 'Budget added successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@login_required
def get_budget(request):
    if request.method == 'GET':
        user = request.user
        
        try:
            budget = Budget.objects.get(user=user)
            budget_data = {
                'user': budget.user.username,
                'amount': budget.amount,
                'description': budget.description,
                'date': budget.date
            }
            return JsonResponse({'status': 'success', 'budget': budget_data})
        except Budget.DoesNotExist:
            return JsonResponse({'status': 'success', 'budget': 'Budget not found'})

@login_required
def delete(request,id):
    if request.method == 'POST':
        try:
            expense = Expense.objects.get(id=id)
            expense.delete()
            return JsonResponse({'status': 'success', 'message': 'Expense deleted successfully'})
        except Expense.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Expense not found'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@login_required
def update(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        expense_id = data['Expense_id']
        amount = data['amount']
        description = data['description']
        date = data['date']
        is_income = data.get('is_income', False)
        is_deduction = data.get('is_deduction', False)

        try:
            expense = Expense.objects.get(id=expense_id)
            expense.amount = amount
            expense.description = description
            expense.date = date
            expense.is_income = is_income
            expense.is_deduction = is_deduction
            expense.save()
            return JsonResponse({'status': 'success', 'message': 'Expense updated successfully'})
        except Expense.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Expense not found'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@login_required
def get_expense(request):
    if request.method == 'GET':
        expense_id = request.GET.get('expense_id')
        try:
            expense = Expense.objects.get(id=expense_id)
            expense_data = {
                'user': expense.user,
                'amount': expense.amount,
                'description': expense.description,
                'date': expense.date
            }
            return JsonResponse({'status': 'success', 'expense': expense_data})
        except Expense.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Expense not found'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@login_required
def get_expenses(request):
    
    if request.method == 'GET':
        user = request.user
        expenses = Expense.objects.filter(user=user)
        

        expense_list = []
        
        for expense in expenses:
            json_expense = model_to_dict(expense)
            print(json_expense)
            expense_list.append(json.dumps(json_expense, default=str))
        return JsonResponse({'status': 'success', 'expenses': expense_list})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@login_required
def get_user(request):
    if request.method == 'GET':
        user_id = request.user.first_name
        return JsonResponse({'status': 'success', 'first_name': user_id})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
