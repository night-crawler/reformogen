from rest_framework import routers

from sample.api import views as s_views

router = routers.DefaultRouter()

router.register(r'authors', s_views.AuthorViewSet, 'authors')
router.register(r'books', s_views.BookViewSet, 'books')
router.register(r'all', s_views.AllModelFieldsViewSet, 'all')

urlpatterns = router.urls
