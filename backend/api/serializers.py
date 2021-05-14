from rest_framework import serializers
from time import time
from datetime import datetime, date, timezone
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
User = get_user_model()

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('username', 'first_name')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = models.Comment
        fields = '__all__'

    def get_time_ago(self, obj):
        t = datetime.now(timezone.utc) - obj.updated_at
        days = int(t.days)
        hours = int(t.seconds//3600)
        minutes = int((t.seconds//60)%60)

        time_ago = ''
        if days > 0:
            time_ago += str(days) + ' days '
        elif hours > 0:
            time_ago += str(hours) + ' hours '
        elif minutes > 0:
            time_ago += str(minutes) + ' minutes '

        time_ago += 'ago'

        return time_ago

class BookSerializer(serializers.ModelSerializer):
    tags = TagSerializer(read_only=True, many=True)
    comments = CommentSerializer(read_only=True, many=True)
    user = UserSerializer(read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = models.Book
        fields = '__all__'

    def get_time_ago(self, obj):
        t = datetime.now(timezone.utc) - obj.updated_at
        days = int(t.days)
        hours = int(t.seconds//3600)
        minutes = int((t.seconds//60)%60)

        time_ago = ''
        if days > 0:
            time_ago += str(days) + ' days '
        elif hours > 0:
            time_ago += str(hours) + ' hours '
        elif minutes > 0:
            time_ago += str(minutes) + ' minutes '

        time_ago += 'ago'

        return time_ago

    def transform_time_ago(self, obj, value):
        return 0

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        fields = '__all__'


class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Line
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name')
        extra_kwargs = {
            'first_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
