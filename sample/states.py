from django.utils.translation import ugettext_lazy as _

# Third Party
from model_utils import Choices

COLOR_CHOICES = Choices(
    (0, 'default', 'default'),
    (1, 'green', 'green'),
    (2, 'red', 'red'),
    (3, 'orange', 'orange'),
    (4, 'yellow', 'yellow'),
    (5, 'olive', 'olive'),
    (6, 'teal', 'teal'),
    (7, 'blue', 'blue'),
    (8, 'violet', 'violet'),
    (9, 'purple', 'purple'),
    (10, 'pink', 'pink'),
    (11, 'brown', 'brown'),
    (12, 'grey', 'grey'),
    (13, 'black', 'black'),
)


AUTHOR_CHOICES = Choices(
    (0, 'dead', _('dead')),
    (255, 'alive', _('alive')),
    (30, 'dried', _('dried')),
)
