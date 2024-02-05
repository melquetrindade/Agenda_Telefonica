from django.shortcuts import render
from rest_framework import viewsets
#from .models import Clientes, EnderecoContato
#from .serializers import ClientesSerializer, EnderecoContatoSerializer
from .models import Contatos, Telefones, EnderecoContato
from .serializers import ContatosSerializer, TelefonesSerializer, EnderecoContatoSerializer

# Create your views here.
class ContatosViewSet(viewsets.ModelViewSet):
    queryset = Contatos.objects.all()
    serializer_class = ContatosSerializer

class EnderecoContatoViewSet(viewsets.ModelViewSet):
    queryset = EnderecoContato.objects.all()
    serializer_class = EnderecoContatoSerializer

class TelefonesViewSet(viewsets.ModelViewSet):
    queryset = Telefones.objects.all()
    serializer_class = TelefonesSerializer