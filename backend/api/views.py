from django.shortcuts import render
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import BookSerializer, UserSerializer, NoteSerializer, LineSerializer,TagSerializer, RegisterSerializer
from .models import Book, User, Note, Line, Comment, Tag

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

    def post(self, request, *args, **kwargs):
        title = request.data.get('title')
        description = request.data.get('description')
        is_public = request.data.get('is_public')
        user_id = request.user.id
        tags = request.data.get('tags').split(',')

        book = Book.objects.create(title=title, description=description,
                                   is_public=is_public, user_id=user_id)
        for tag in tags:
            t = None
            try:
                t = Tag.objects.get(name=tag)
            except Tag.DoesNotExist:
                t = Tag.objects.create(name=tag)
            book.tags.add(t)

        return Response(status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        book = Book.objects.get(id=book_id)
        if (request.data.get('is_public')):
            book.is_public = request.data.get('is_public')
        if (request.data.get('description')):
            book.description = request.data.get('description')
        book.save()
        return Response(status=status.HTTP_200_OK)


class BooksApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        user_id = request.user.id
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
        if (request.data.get('coords_update')):
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


class FeedApiView(APIView):
    permission_classes= (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        books = Book.objects.filter(is_public=True)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PublicBookApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        books = Book.objects.filter(user_id=user_id, is_public=True)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        user_id = request.user.id
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
        user_id = request.user.id
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

    def patch(self, request, *args, **kwargs):
        start_id = request.data.get('start_id')
        end_id = request.data.get('end_id')
        book_id = request.data.get('book_id')
        l = Line.objects.get(start_id=start_id, end_id=end_id, book_id=book_id)
        l.delete()
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        start_id = request.data.get('start_id')
        end_id = request.data.get('end_id')
        book_id = request.data.get('book_id')
        colors = ['red', 'green', 'blue', 'pink', 'black', 'purple', 'orange', 'yellow', 'brown', 'cyan',]
        color = random.choice(colors)
        Line.objects.create(start_id=start_id, end_id=end_id, book_id=book_id, color=color)
        return Response({}, status=status.HTTP_200_OK)

class CommentApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        user_id = request.user.id
        content = request.data.get('content')

        Comment.objects.create(content=content, book_id=book_id, user_id=user_id)

        return Response({}, status=status.HTTP_200_OK)

class TagApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        tags = Tag.objects.all()
        print(tags, "\n\n\n\n\n")
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserApiView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
