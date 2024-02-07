from django.contrib.auth.models import User
from rest_framework import serializers, validators
from . models import MyUser
from rest_framework.validators import UniqueValidator

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ('email', 'password', 'first_name', 'last_name')

        extra_kwargs = {
            "password": {"write_only": True},
            "email": {
                "required": True,
                "allow_blank": False,
                "validators": [
                    UniqueValidator(
                        queryset=MyUser.objects.all(),
                        message="Já existe um usuário com esse e-mail"
                    )
                ]
            },
            "first_name": {"required": False},
            "last_name": {"required": False}
        }

    def create(self, validated_data):
        user = MyUser.objects.create_user(**validated_data)
        return user

'''
class registerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

        extra_kwargs = {
            "password": {"write_only": True},
            "email": {
                "required": True,
                "allow_blank": False,
                "validators": [
                    validators.UniqueValidator(
                        User.objects.all(), "A user with that Email already exists"
                    )
                ]
            },
            "first_name": {"required": False},
            "last_name": {"required": False}
        }

    def create(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        email = validated_data.get('email')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')

        user = User.objects.create(
            username = username,
            password = password,
            email = email,
            first_name = first_name,
            last_name = last_name
        )

        return user
'''