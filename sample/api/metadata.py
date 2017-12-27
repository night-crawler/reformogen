from django.utils.text import format_lazy
from django.utils.translation import ugettext_lazy as _

from drf_metadata.meta import MetaData
from rest_framework.reverse import reverse_lazy

from sample import models as wf_models


class BookMetadata(MetaData):
    model = wf_models.Book

    def get_title(self, request, view, obj: wf_models.Book):
        if obj:
            return _('Edit Book "{0}"').format(obj.printable_name)
        return _('Create Book')


class AuthorMetadata(MetaData):
    model = wf_models.Author

    update_fields = {
        'state': {'autocomplete': True},
        # 'dt_death': {'editable': False, },
        # 'name': {'editable': False},
        'nickname': {
            'password': True,
        },
        'is_ghostwriter': {
            'widget': 'toggle',
        }
    }

    dataset_urls = {
        'favorite_book': format_lazy('{}{}', 'http://localhost:8000', reverse_lazy('books-list'))
    }

    def get_inspire_source_dataset_url(self, field, obj):
        return 'http://localhost:8000%s' % reverse_lazy('authors-list')

    def get_title(self, request, view, obj: wf_models.Author):
        if obj:
            return _('Edit Author "{0}"').format(obj.printable_name())
        return _('Create Author')


class AuthorPhotoMetadata(MetaData):
    model = wf_models.AuthorPhoto

    update_fields = {
        'photo': {
            'multiple': True,
            # ensure upload_url is lazy (premature import case)
            'upload_url': format_lazy('{}{}', 'http://localhost:8000', reverse_lazy('all-accept-file')),
            'delete_url': True,
        }
    }


class AuthorPhotoWithoutAuthorMetadata(MetaData):
    model = wf_models.AuthorPhoto
    exclude = 'author'

    update_fields = {
        'photo': {
            # ensure upload_url is lazy (premature import case)
            'upload_url': format_lazy('{}{}', 'http://localhost:8000', reverse_lazy('all-accept-file'))
        }
    }


class AllModelFieldsMetadata(MetaData):
    model = wf_models.AllModelFields

    update_fields = {
        'f_file': {
            # ensure upload_url is lazy (premature import case)
            'upload_url': format_lazy('{}{}', 'http://localhost:8000', reverse_lazy('all-accept-file'))
        },
        'f_photo': {
            # ensure upload_url is lazy (premature import case)
            'upload_url': format_lazy('{}{}', 'http://localhost:8000', reverse_lazy('all-accept-file'))
        }
    }

    def get_f_fk_rel_dataset_url(self, field, obj):
        return 'http://localhost:8000%s' % reverse_lazy('books-list')

    def get_f_m2m_rel_dataset_url(self, field, obj):
        return 'http://localhost:8000%s' % reverse_lazy('authors-list')

    def get_title(self, request, view, obj: wf_models.AllModelFields):
        if obj:
            return _('Edit AllModelFields "{0}"').format(obj.printable_name())
        return _('Create AllModelFields')
