from django.urls import include, path
from . import views

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
        path('books/', views.BookApiView.as_view()),
        path('books/public', views.PublicBookApiView.as_view()),
        path('books/private', views.PrivateBookApiView.as_view()),
        path('books/<str:user_name>', views.UserBookApiView.as_view()),
]
