from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from sample import models as s_models
from sample import abstract


class StateBundleMixin(serializers.ModelSerializer):
    state_bundle = serializers.SerializerMethodField()

    @staticmethod
    def get_state_bundle(obj: abstract.StateBundleMixin):
        return obj.state_bundle


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = s_models.Author
        fields = '__all__'

    # TODO:
    def validate(self, attrs):
        raise ValidationError({
            'lol': ['This is sad'],
            'lol2': ['This is sad fuck you'],
        })
        return attrs


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = s_models.Book
        fields = '__all__'


class AllModelFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = s_models.AllModelFields
        fields = '__all__'

