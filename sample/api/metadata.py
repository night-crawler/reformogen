from django.utils.translation import ugettext_lazy as _

from drf_metadata.meta import MetaData
from rest_framework.reverse import reverse_lazy

from sample import models as wf_models


class AuthorMetadata(MetaData):
    model = wf_models.Author

    update_fields = {
        'state': {'autocomplete': True},
        'dt_death': {'editable': False, },
        # 'name': {'editable': False},
    }

    def get_title(self, request, view, obj: wf_models.Author):
        if obj:
            return _('Edit Author "{0}"').format(obj.printable_name)
        return _('Create Author')


class BookMetadata(MetaData):
    model = wf_models.Book

    def get_title(self, request, view, obj: wf_models.Book):
        if obj:
            return _('Edit Book "{0}"').format(obj.printable_name)
        return _('Create Book')


class AllModelFieldsMetadata(MetaData):
    model = wf_models.AllModelFields

    update_fields = {
        # 'state': {'autocomplete': True},
        # 'dt_death': {'editable': False, },
        'f_m2m_rel': {'data': reverse_lazy('authors-list')},
        'f_fk_rel': {'data': reverse_lazy('books-list')},
    }

    def get_title(self, request, view, obj: wf_models.AllModelFields):
        if obj:
            return _('Edit AllModelFields "{0}"').format(obj.printable_name)
        return _('Create AllModelFields')
