from django.db import models

# Create your models here.
class Product(models.Model):
    
    company = models.ForeignKey(
        'main.Company', 
        on_delete=models.CASCADE)
    
    UNIT_CHOICES = [
        ("pcs", "шт"),
        ("kg", "кг"),
        ("l", "л"),
        
    ]
    name = models.CharField("Назва", max_length=200)
    price = models.DecimalField("Ціна", max_digits=10, decimal_places=2)
    balance = models.DecimalField("Баланс", max_digits=10, decimal_places=2, default=0)
    unit = models.CharField("Одиниця виміру", max_length=20, choices=UNIT_CHOICES,default="pcs")
    
    def __str__(self):
        return self.name