import typing as t

from django.utils.translation import ugettext_lazy as _

from rest_framework.exceptions import ValidationError

# Third Party
from model_utils import Choices


def choice_identifier(choices: Choices, db_val) -> str:
    # noinspection PyProtectedMember
    for k, v in choices._identifier_map.items():
        if v == db_val:
            return k
    raise KeyError('No %s in choices' % db_val)


# noinspection PyProtectedMember
def clean_choice_values(choices: Choices, values: t.List[str]) -> t.Set[str]:
    possible_choices = set()
    for v in values:
        if isinstance(v, str) and v.isdecimal():
            v = int(v)
        if v in choices:
            possible_choices.add(int(v))
            continue
        if v in choices._identifier_map.keys():
            possible_choices.add(choices._identifier_map[str(v)])
            continue
        raise ValidationError(_('Wrong choice `%s`') % v)
    return possible_choices


# noinspection PyUnresolvedReferences
class StateBundleMixin:
    @property
    def state_bundle(self) -> dict:
        return {
            'display': self.get_state_display(),
            'identifier': choice_identifier(self.STATE, self.state),
            'value': self.state
        }
