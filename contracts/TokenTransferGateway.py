from django.db import models
from django.contrib.auth.models import User

class WtreeUser(User):
    address = models.CharField(max_length=42)  # Endereços Ethereum têm 42 caracteres

    def __str__(self):
        return f"{self.username} - {self.address}"

class Chain(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()
    icon_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Token(models.Model):
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10)
    contract_address = models.CharField(max_length=42)  # Endereço típico do Ethereum
    chain = models.ForeignKey(Chain, on_delete=models.CASCADE, related_name='tokens')
    icon_url = models.URLField(blank=True, null=True)
    slug = models.SlugField()
    decimals = models.IntegerField(default=18)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

    class Meta:
        unique_together = ('contract_address', 'chain')
        verbose_name = "Token"
        verbose_name_plural = "Tokens"


class Native(models.Model):
    name = models.CharField(max_length=50)  # Ex: "Ethereum", "Binance Coin", "Polygon"
    symbol = models.CharField(max_length=10)  # Ex: "ETH", "BNB", "MATIC"
    blockchain = models.CharField(max_length=50)  # Ex: "Ethereum", "Binance Smart Chain", "Polygon"

    def __str__(self):
        return f"{self.name} ({self.symbol}) on {self.blockchain}"

class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=42)  # Endereços Ethereum têm 42 caracteres

    def __str__(self):
        return f"{self.user.username} - {self.address}"

class FeeSetting(models.Model):
    fee_bps = models.PositiveIntegerField(default=50)  # Taxa inicial de 0.5%
    max_fee_bps = models.PositiveIntegerField(default=100)  # Limite máximo da taxa em base points (1.0%)

    def __str__(self):
        return f"Current fee: {self.fee_bps} bps, Max fee: {self.max_fee_bps} bps"


class TransactionNative(models.Model):
    sender = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='sent_native_transactions')
    recipient = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='received_native_transactions')
    native = models.ForeignKey(Native, on_delete=models.CASCADE)  # Referência ao modelo Native
    amount = models.DecimalField(max_digits=19, decimal_places=4)
    fee = models.DecimalField(max_digits=19, decimal_places=4)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender} to {self.recipient} - {self.amount} {self.native.symbol}"

class TransactionToken(models.Model):
    sender = models.ForeignKey(Account, related_name='sent_token_transactions', on_delete=models.CASCADE)
    recipient = models.ForeignKey(Account, related_name='received_token_transactions', on_delete=models.CASCADE)
    token = models.ForeignKey(Token, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=19, decimal_places=4)
    fee = models.DecimalField(max_digits=19, decimal_places=4)
    is_allowed = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "allowed" if self.is_allowed else "not allowed"
        return f"From {self.sender} to {self.recipient} - {self.amount} {self.token.symbol} ({status})"

class AllowedToken(models.Model):
    token = models.ForeignKey(Token, on_delete=models.CASCADE)
    is_allowed = models.BooleanField(default=True)

    def __str__(self):
        status = "allowed" if self.is_allowed else "not allowed"
        return f"{self.token.name} ({self.token.symbol}) is {status}"
