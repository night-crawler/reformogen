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

    def get_queryset(self) -> models.QuerySet:
        return s_models.Author.objects.all()
