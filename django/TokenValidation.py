from django.http import JsonResponse
from .models import Token, TransactionToken, Wallet

def validate_token_transaction(request, token_symbol, recipient_address, amount):
    try:
        # Obtém o token do banco de dados
        token = Token.objects.get(symbol=token_symbol)
        
        # Confirma se o remetente é quem ele diz ser
        sender_account = Wallet.objects.get(user=request.user, address=request.user.username)
        
        # Cria uma nova transação de token
        transaction = TransactionToken(sender=sender_account,
                                       recipient=Wallet.objects.get(address=recipient_address),
                                       token=token,
                                       amount=amount)
        transaction.save()
        
        return JsonResponse({'status': 'success', 'message': 'Transaction successfully validated and saved.'})
    except Token.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Token not found.'})
    except Wallet.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Wallet not found.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
