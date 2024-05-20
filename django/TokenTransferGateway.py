from django.db import models
from django.contrib.auth.models import User
    
class WtreeProfile(models.Model):
    # no need to store balance here, it can be calculated from the transactions and get from the wallet via web3
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    username = models.CharField(max_length=50, unique=True) # no frontend será algo do tipo https://wtr.ee/user.name
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    selected_networks = models.ManyToManyField('Network', related_name='profiles_selected', blank=True) # networks that user accepts to receive tokens or natives
    selected_natives = models.ManyToManyField('Native', related_name='profiles_selected', blank=True) # natives that user accepts to receive
    selected_tokens = models.ManyToManyField('Token', related_name='profiles_selected', blank=True) # tokens that user accepts to receive
    wallets = models.ManyToManyField('Wallet', related_name='profiles', blank=True) # wallets that this profile uses, initially it will be only one wallet per profile, ethereum wallet (matic, bnb and eth), but need to think for example in bitcoin or fiat wallets in same profile.
    

    def __str__(self):
        return f"{self.user.username}"

class Network(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()
    icon_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Token(models.Model):
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10)
    contract_address = models.CharField(max_length=42)  # Endereço típico do Ethereum
    blockchain = models.ForeignKey(Network, on_delete=models.CASCADE, related_name='tokens')
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
    blockchain = models.ForeignKey(Network, on_delete=models.CASCADE, related_name='natives')

    def __str__(self):
        return f"{self.name} ({self.symbol}) on {self.blockchain}"

class Wallet(models.Model):
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
    sender = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='sent_native_transactions')
    recipient = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='received_native_transactions')
    native = models.ForeignKey(Native, on_delete=models.CASCADE)  # Referência ao modelo Native
    amount = models.DecimalField(max_digits=19, decimal_places=4)
    fee = models.DecimalField(max_digits=19, decimal_places=4)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender} to {self.recipient} - {self.amount} {self.native.symbol}"

class TokenTransaction(models.Model):
    sender = models.ForeignKey(Wallet, related_name='sent_token_transactions', on_delete=models.CASCADE)
    recipient = models.ForeignKey(Wallet, related_name='received_token_transactions', on_delete=models.CASCADE)
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
