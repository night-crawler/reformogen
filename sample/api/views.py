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


class AuthorViewSet(viewsets.ModelViewSet, DescribeMixin):
    serializer_class = s_serializers.AuthorSerializer

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
