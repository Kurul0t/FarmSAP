#main\models.py
from django.db import models

# Create your models here.
class Company(models.Model):
    name = models.CharField("Назва підприємства", max_length=50)
    order_counter = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name