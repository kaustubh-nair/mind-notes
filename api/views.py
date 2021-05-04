from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import BookSerializer, UserSerializer, NoteSerializer, LineSerializer, RegisterSerializer
from .models import Book, User, Note, Line

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer


class BookApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        book_id = int(dict(request.GET)['book_id'][0])
        books = Book.objects.filter(id=book_id).first()
        serializer = BookSerializer(books)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BooksApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        user_id = int(dict(request.GET)['user_id'][0])
        books = Book.objects.filter(user_id=user_id)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookNoteApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        book_id = int(dict(request.GET)['book_id'][0])
        book = Book.objects.get(id=book_id)
        notes = Note.objects.filter(book=book)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        book = Book.objects.get(id=book_id)
        parent = Note.objects.first()
        note = Note(
                    name=request.data.get('name'),
                    content=request.data.get('content'),
                    x=request.data.get('x'),
                    y=request.data.get('y'),
                    book=book,
                    parent=parent,
                )
        note.save()
        return Response({}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        book = Book.objects.get(id=book_id)
        note = Note.objects.get(id=request.data.get('note_id'))

        if (request.data.get('name')):
            note.name = request.data.get('name')
        if (request.data.get('content')):
            note.content = request.data.get('content')
        if (request.data.get('x')):
            note.x = request.data.get('x')
        if (request.data.get('y')):
            note.y = request.data.get('y')

        note.save()
        return Response({}, status=status.HTTP_200_OK)

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
    permission_classes = (IsAuthenticated,)
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
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        note_id = request.data.get('note_id')
        note = Note.objects.get(id=note_id)
        serializer = NoteApiView(note)
        return Response(serializer.data, status=status.HTTP_200_OK)



class PrivateBookApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        user_id = int(dict(request.GET)['user_id'][0])
        books = Book.objects.filter(user_id=user_id, is_public=False)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserBookApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, user_name, *args, **kwargs):
        user = User.objects.get(name=user_name)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LinesApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        book_id = int(dict(request.GET)['book_id'][0])
        book = Book.objects.get(id=book_id)
        lines = Line.objects.filter(book=book)
        serializer = LineSerializer(lines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
