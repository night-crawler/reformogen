from django.utils.translation import ugettext_lazy as _

from drf_metadata.meta import MetaData

from sample import models as wf_models


class AuthorMetadata(MetaData):
    model = wf_models.Author

    def get_title(self, request, view, obj: wf_models.Author):
        if obj:
            return _('Edit Author "{0}"').format(obj.printable_name)
        return _('Create Author')
