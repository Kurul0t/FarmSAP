#order\models.py
from django.db import models, transaction
from main.models import Company

class Order(models.Model):
    company = models.ForeignKey(
        'main.Company',
        on_delete=models.CASCADE,
        related_name="orders"
    )

    client = models.ForeignKey(
        'client.Client',
        on_delete=models.PROTECT,
        related_name='orders',
        null=True,
        blank=True,
        verbose_name="Клієнт"
    )

    created_at = models.DateTimeField("Дата створення", auto_now_add=True)
    local_id = models.PositiveIntegerField("Внутрішній id", editable=False)
    title = models.CharField(max_length=255, blank=True)

    total = models.DecimalField(
        "Загальна сума",
        max_digits=10,
        decimal_places=2,
    )

    STATUS_CHOICES = [
        ("waiting", "Очікує комплектування"),
        ("packing", "Комплектується"),
        ("packed", "Сформовано"),
        ("delivery", "В дорозі"),
        ("completed", "Завершено"),
    ]

    status = models.CharField(
        "Статус",
        max_length=20,
        choices=STATUS_CHOICES,
        default="waiting"
    )

    DELIVERY_CHOICES = [
        ("pickup", "Самовивіз"),
        ("courier", "Кур'єр"),
        ("post", "Пошта"),
    ]

    delivery_method = models.CharField(
        "Спосіб доставки",
        max_length=20,
        choices=DELIVERY_CHOICES,
        default="pickup"
    )

    PAYMENT_CHOICES = [
        ("card", "Карта"),
        ("cash", "Готівка"),
    ]

    payment_method = models.CharField(
        "Спосіб оплати",
        max_length=20,
        choices=PAYMENT_CHOICES,
    )

    POSTOFFICES = [
        ("ukrpost", "Укрпошта"),
        ("nova_poshta", "Нова пошта"),
    ]

    post_service = models.CharField(
        "Служба доставки",
        max_length=50,
        blank=True,
        choices=POSTOFFICES,
    )

    # snapshot-дані клієнта на момент замовлення
    customer_name = models.CharField("ПІБ клієнта", max_length=200)
    customer_phone = models.CharField("Телефон клієнта", max_length=50)
    delivery_address = models.TextField("Адреса доставки", blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'local_id'],
                name='unique_order_number_per_company'
            )
        ]

    @property
    def receipt_number(self):
        return 1000 + self.local_id

    def save(self, *args, **kwargs):
        if not self.pk:
            with transaction.atomic():
                company = Company.objects.select_for_update().get(pk=self.company.pk)
                company.order_counter += 1
                company.save(update_fields=["order_counter"])
                self.local_id = company.order_counter

                if not self.title:
                    self.title = f"Замовлення №{self.receipt_number}"

                super().save(*args, **kwargs)
            return

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Замовлення №{self.receipt_number} - {self.company.name}"