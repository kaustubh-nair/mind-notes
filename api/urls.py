from django.urls import include, path
from . import views

urlpatterns = [
        path('books/', views.BookApiView.as_view()),
        path('books/public', views.PublicBookApiView.as_view()),
        path('books/private', views.PrivateBookApiView.as_view()),
        path('books/user/<str:user_name>', views.UserBookApiView.as_view()),
        path('books/note', views.BookNoteApiView.as_view()),
        path('books/note', views.BookNoteApiView.as_view()),
        path('note', views.NoteApiView.as_view()),
]
