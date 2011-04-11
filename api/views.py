from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import BookSerializer, UserSerializer
from .models import Book, User

class BookApiView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = int(dict(request.GET)['user_id'][0])
        books = Book.objects.filter(user_id=user_id)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PublicBookApiView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = int(dict(request.GET)['user_id'][0])
        books = Book.objects.filter(user_id=user_id, is_public=True)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        user_id = int(dict(request.GET)['user_id'][0])
        books = Book.objects.filter(user_id=user_id, is_public=True)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PrivateBookApiView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = int(dict(request.GET)['user_id'][0])
        books = Book.objects.filter(user_id=user_id, is_public=False)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserBookApiView(APIView):
    def get(self, request, user_name, *args, **kwargs):
        user = User.objects.get(name=user_name)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
