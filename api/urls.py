from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
        path('register/', views.RegisterView.as_view(), name='auth_register'),
	path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),


        path('books/', views.BookApiView.as_view()),
        path('books/notes', views.BookNoteApiView.as_view()),
        path('books/notes/lines', views.LinesApiView.as_view()),
        path('books/public', views.PublicBookApiView.as_view()),
        path('books/private', views.PrivateBookApiView.as_view()),
        path('books/user/<str:user_name>', views.UserBookApiView.as_view()),
        path('note', views.NoteApiView.as_view()),
]
