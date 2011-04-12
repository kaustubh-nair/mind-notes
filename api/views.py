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


class BookNoteApiView(APIView):
    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        book = Book.objects.get(id=book_id)
        parent = Note.objects.get(request.data.get('parent_id'))
        note = Note(
                    name=request.data.get('name'),
                    content=request.data.get('content'),
                    coordinates=request.data.get('coordinates'),
                    book=book,
                    parent=parent,
                )
        if note.save():
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'Invalid request parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        book = Book.objects.get(id=book_id)
        note = Note.objects.get(request.data.get('note_id'))

        data = {}
        if (request.data.get('name')):
            data.update({'name': request.data.get('name')})
        elif (request.data.get('content')):
            data.update({'content': request.data.get('content')})
        elif (request.data.get('name')):
            data.update({'coordinates': request.data.get('coordinates')})

        if note.update(data):
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'Invalid request parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, *args, **kwargs):
        note_id = request.data.get('note_id')
        note = Note.objects.get(id=note_id)
        if note.delete():
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'Invalid request parameters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


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

class NoteApiView(APIView):
    def get(self, request, *args, **kwargs):
        note_id = request.data.get('note_id')
        note = Note.objects.get(id=note_id)
        serializer = NoteApiView(note)
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
