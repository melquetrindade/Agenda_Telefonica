from rest_framework import serializers
#from .models import Clientes, EnderecoContato
from .models import Contatos, Telefones, EnderecoContato
'''
class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = ['id', 'nome', 'endereco', 'idade']
'''

class ContatosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contatos
        fields = ['id', 'nome', 'email']

class TelefonesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefones
        fields = ['id', 'owner', 'telefone']

class EnderecoContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnderecoContato
        fields = ['id', 'contato', 'rua', 'bairro', 'cidade', 'num']
