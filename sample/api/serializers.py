from rest_framework import serializers
from rest_framework.exceptions import ValidationError

# First Party
from sample import abstract
from sample import models as s_models


class CRUDUrlsSerializerMixin(serializers.ModelSerializer):
    urls = serializers.SerializerMethodField()

    @staticmethod
    def get_urls(obj):
        return obj.urls


class StateBundleMixin(serializers.ModelSerializer):
    state_bundle = serializers.SerializerMethodField()

    @staticmethod
    def get_state_bundle(obj: abstract.StateBundleMixin):
        return obj.state_bundle


class BookSerializer(CRUDUrlsSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = s_models.Book
        fields = '__all__'


class AuthorPhotoSerializer(CRUDUrlsSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = s_models.AuthorPhoto
        fields = '__all__'


class AuthorPlainSerializer(CRUDUrlsSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = s_models.Author
        fields = '__all__'

    def validate(self, attrs):
        if attrs.get('name') == '666':
            raise ValidationError({
                'non-field validation error 1': ['This is the first error'],
                'non-field validation error 2': [
                    'This is the first error',
                    'This is the second error'
                ],
            })
        return attrs


class AuthorSerializer(CRUDUrlsSerializerMixin, serializers.ModelSerializer):
    inspire_source = AuthorPlainSerializer(many=True)
    favorite_book = BookSerializer()

    class Meta:
        model = s_models.Author
        fields = '__all__'


class AllModelFieldsSerializer(CRUDUrlsSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = s_models.AllModelFields
        fields = '__all__'
