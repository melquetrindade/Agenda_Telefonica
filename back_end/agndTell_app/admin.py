from django.contrib import admin
#from .models import Clientes, EnderecoContato
from .models import Contatos, Telefones, EnderecoContato
# Register your models here.

#admin.site.register(Clientes)
admin.site.register(Telefones)
admin.site.register(EnderecoContato)
admin.site.register(Contatos)
