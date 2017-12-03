import time
import typing as t

from django.db import models
from rest_framework.decorators import list_route, detail_route
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import viewsets

from sample.api import metadata
from sample.api import serializers as s_serializers
from sample import models as s_models


class MultiSerializerViewSetMixin:
    def get_serializer_class(self, action=None):
        """
        Look for serializer class in self.serializer_action_classes, which
        should be a dict mapping action name (key) to serializer class (value),
        i.e.:

        class MyViewSet(MultiSerializerViewSetMixin, ViewSet):
            serializer_class = MyDefaultSerializer
            serializer_action_classes = {
               'list': MyListSerializer,
               'my_action': MyActionSerializer,
            }

            @action
            def my_action:
                ...

        If there's no entry for that action then just fallback to the regular
        get_serializer_class lookup: self.serializer_class, DefaultSerializer.

        Thanks gonz: http://stackoverflow.com/a/22922156/11440

        """
        try:
            return self.serializer_action_classes[action or self.action]
        except (KeyError, AttributeError):
            return super(MultiSerializerViewSetMixin, self).get_serializer_class()


class DescribeMixin:
    def __get_metadata_class(self):
        serializer_class = self.get_serializer_class()
        model_class = serializer_class.Meta.model
        return getattr(metadata, '%sMetadata' % model_class.__name__)

    @list_route()
    def describe(self, request: Request) -> Response:
        metadata_class = self.__get_metadata_class()
        md = metadata_class().determine_metadata(request, self)
        return Response(md)

    @detail_route()
    def describe_object(self, request, pk):
        metadata_class = self.__get_metadata_class()
        return Response(metadata_class().determine_metadata(request, self, self.get_object()))


class AuthorViewSet(MultiSerializerViewSetMixin, DescribeMixin, viewsets.ModelViewSet):
    serializer_class = s_serializers.AuthorSerializer
    serializer_action_classes = {
        'create': s_serializers.AuthorPlainSerializer,
        'update': s_serializers.AuthorPlainSerializer,
        'partial_update': s_serializers.AuthorPlainSerializer,
    }

    def dispatch(self, request, *args, **kwargs):
        # time.sleep(2)
        # return Response(data={'get out': True}, status=502)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self) -> models.QuerySet:
        return s_models.Author.objects.all()

    def filter_queryset(self, queryset: models.QuerySet):
        qp = self.request.query_params

        search = qp.get('q') or qp.get('search') or qp.get('query')
        if search:
            return queryset.filter(name__icontains=search)

        ids = qp.getlist('id__in')
        if ids:
            return queryset.filter(id__in=ids)

        return queryset


class BookViewSet(viewsets.ModelViewSet, DescribeMixin):
    serializer_class = s_serializers.BookSerializer

    def dispatch(self, request, *args, **kwargs):
        # time.sleep(2)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self) -> models.QuerySet:
        return s_models.Book.objects.all()

    def filter_queryset(self, queryset: models.QuerySet):
        qp = self.request.query_params
        search = qp.get('q') or qp.get('search') or qp.get('query')
        if search:
            return queryset.filter(title__icontains=search)
        return queryset


class AllModelFieldsViewSet(viewsets.ModelViewSet, DescribeMixin):
    serializer_class = s_serializers.AllModelFieldsSerializer

    def dispatch(self, request, *args, **kwargs):
        # time.sleep(2)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self) -> models.QuerySet:
        return s_models.AllModelFields.objects.all()

    @list_route(['POST'])
    def accept_file(self, request: Request):
        print(request.FILES)
        return Response({'lol': 1})
