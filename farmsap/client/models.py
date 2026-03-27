from django.db import models


class Client(models.Model):
    company = models.ForeignKey(
        'main.Company',
        on_delete=models.CASCADE,
        related_name='clients'
    )

    full_name = models.CharField("ПІБ клієнта", max_length=200)
    phone = models.CharField("Телефон клієнта", max_length=50)
    email = models.EmailField("Email", blank=True)
    default_address = models.TextField("Адреса за замовчуванням", blank=True)

    created_at = models.DateTimeField("Дата створення", auto_now_add=True)
    updated_at = models.DateTimeField("Дата оновлення", auto_now=True)

    class Meta:
        ordering = ['full_name']
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'full_name', 'phone'],
                name='unique_client_per_company_name_phone'
            )
        ]

    def __str__(self):
        return f"{self.full_name} ({self.phone})"
    