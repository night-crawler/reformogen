from rest_framework import routers

from sample.api import views as s_views

router = routers.DefaultRouter()

router.register(r'authors', s_views.AuthorViewSet, 'authors')

urlpatterns = router.urls
