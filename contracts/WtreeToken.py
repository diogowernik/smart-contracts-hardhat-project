from django.db import models

class Token(models.Model):
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10)
    total_supply = models.DecimalField(max_digits=19, decimal_places=4)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

class Account(models.Model):
    address = models.CharField(max_length=42)  # Endereços Ethereum têm 42 caracteres
    balance = models.DecimalField(max_digits=19, decimal_places=4)

    def __str__(self):
        return f"Address: {self.address}"

class Transaction(models.Model):
    sender = models.ForeignKey(Account, related_name='sent_transactions', on_delete=models.CASCADE)
    recipient = models.ForeignKey(Account, related_name='received_transactions', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=19, decimal_places=4)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender} to {self.recipient} amount {self.amount}"
