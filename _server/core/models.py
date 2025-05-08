from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Expense(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.description} - {self.date} -  {self.name} -{self.date}"


class Budget(models.Model):
    user =  models.OneToOneField(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.description} - {self.date}"
