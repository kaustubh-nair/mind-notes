from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime


class User(AbstractUser):
    subscribed_tags = models.ManyToManyField("Tag")
    favourite_books = models.ManyToManyField("Book", related_name='+')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.first_name

class Tag(models.Model):
    name = models.CharField(max_length=100)
    is_private = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=400)
    is_public = models.BooleanField(default=False)
    votes = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Note(models.Model):
    name = models.CharField(max_length=100)
    content = models.TextField(default='', max_length=100000)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, blank=True, null=True)
    parent = models.ForeignKey("Note", on_delete=models.SET_NULL, blank=True, null=True)

    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name



class Comment(models.Model):
    content = models.CharField(max_length=300)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Line(models.Model):
    start = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='+')
    end = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='+')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    color = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
