from django.db import models
from django.utils import timezone


class Transactions(models.Model):
    company = models.ForeignKey(
        "main.Company",
        on_delete=models.CASCADE,

    )
    INCOME = "income"
    EXPENSE = "expense"

    TYPE_CHOICES = [
        (INCOME, "Прибуток"),
        (EXPENSE, "Витрата"),
    ]

    title = models.CharField("Назва", max_length=100)
    text = models.TextField("Опис", blank=True)
    date = models.DateField("Дата", default=timezone.now)
    suma = models.DecimalField("Сума", max_digits=10, decimal_places=2)
    type = models.CharField("Тип", max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.title} ({self.suma}) - {self.company.name}"