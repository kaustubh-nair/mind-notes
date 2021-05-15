from django.test import TestCase
from . import models
from rest_framework.test import APIRequestFactory


factory = APIRequestFactory()

class ModelsTestCase(TestCase):

    def can_query_for_all_books_of_current_user(self):
        user = models.User.objects.create(username="test")
        book = Book.objects.create(title="title", description="qwe", user=user)
        force_authenticate(request, user=user)

        self.response = self.client.get(
            "/api/books/"
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
        self.assertContains(response, book)
        self.assertContains(response, "title")

    def can_create_new_note_in_book(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        self.data = {
                'book_id': book.id,
                'name': 'abc',
                'content': 'asd',
                'x': 10,
                'y': 200,
                }
        force_authenticate(request, user=user)

        self.response = self.client.post(
            "/api/books/notes"
            self.data,
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)

    def can_create_comment_on_book(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.response = self.client.post(
            "/api/books/comment"
            self.data,
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
        self.assertContains(response, expected_response)

    def can_change_is_public_in_book(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.data = {
                'is_public': true
        }
        self.response = self.client.post(
            "/api/book/"
            self.data,
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)


    def can_retrieve_lines(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.response = self.client.get(
            "/api/books/notes/lines"
            self.data,
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
        self.assertContains(response, expected_response)

    def can_retrieve_public_books(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.response = self.client.get(
            "/api/books/public"
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)

    def can_create_new_lines_in_book(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        note1 = Note.objects.create(name="name", content="qwe", book_id=book.id)
        note2 = Note.objects.create(name="name", content="qwe", book_id=book.id)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)

        self.data = {
                'book_id': book.id,
                'start_id': note1.id,
                'end_id': note2.id,
        }

        self.response = self.client.post(
            "/api/books/notes/lines"
            self.data,
            format="json")

        line = len(Line.objects.all())
        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
        self.assertEqual(line, 1)

    def can_retrieve_note(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        note1 = Note.objects.create(name="name", content="qwe", book_id=book.id)
        force_authenticate(request, user=user)
        self.response = self.client.get(
            "/api/note"
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
        self.assertContains(response, note1.name)

    def can_retrieve_feed(self):
        book = Book.objects.create(title="title", description="qwe", user=user, is_public=True)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.response = self.client.get(
            "/api/feed"
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
        self.assertContains(response, book.title)

    def can_retrieve_tags(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.response = self.client.get(
            "/api/tags"
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)

    def can_retrieve_user(self):
        book = Book.objects.create(title="title", description="qwe", user=user)
        user = models.User.objects.create(username="test")
        force_authenticate(request, user=user)
        self.response = self.client.get(
            "/api/user"
            format="json")

        self.assertEqual(self.response.status_code, status.HTTP_200_CREATED)
