from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
        path('register/', views.RegisterView.as_view(), name='auth_register'),
	path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('logout/', views.LogoutView.as_view(), name='auth_logout'),

        path('books/', views.BooksApiView.as_view()),
        path('book/', views.BookApiView.as_view()),
        path('books/notes', views.BookNoteApiView.as_view()),
        path('books/comment', views.CommentApiView.as_view()),
        path('books/notes/lines', views.LinesApiView.as_view()),
        path('books/public', views.PublicBookApiView.as_view()),
        path('books/private', views.PrivateBookApiView.as_view()),
        path('books/user/<str:user_name>', views.UserBookApiView.as_view()),
        path('note', views.NoteApiView.as_view()),
        path('feed', views.FeedApiView.as_view()),
        path('tags', views.TagApiView.as_view()),
        path('user', views.UserApiView.as_view()),
]
