from django.db import models

# Create your models here.
'''
class Clientes(models.Model):
    nome = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    telefone = models.CharField(max_length=25)

    def __str__(self):
        return self.nome
'''

class Contatos(models.Model):
    nome = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nome

class EnderecoContato(models.Model):
    contato = models.OneToOneField(Contatos, on_delete=models.CASCADE)
    rua = models.CharField(max_length=255)
    bairro = models.CharField(max_length=255)
    cidade = models.CharField(max_length=255)
    num = models.CharField(max_length=10)

    def __str__(self):
        return self.rua


class Telefones(models.Model):
    owner = models.ForeignKey(Contatos, on_delete=models.CASCADE)
    telefone = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.telefone
