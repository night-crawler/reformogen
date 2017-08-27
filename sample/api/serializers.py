from django.contrib.auth.models import User
from rest_framework import serializers

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


