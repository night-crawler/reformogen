from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import ugettext_lazy as _
from easy_thumbnails.fields import ThumbnailerImageField
from model_utils.fields import AutoCreatedField, AutoLastModifiedField
from django.core.exceptions import ValidationError
from sample import states
from sample import abstract


def positive_integer_validator(value):
    if not isinstance(value, int):
        raise ValidationError(
            _('%(value)s MUST be integer'),
            params={'value': value},
        )

    if value <= 0:
        raise ValidationError(
            _('%(value)s MUST be positive'),
            params={'value': value},
        )


class PositiveSetField(ArrayField):
    def clean(self, value, model_instance):
        res = super().clean(value, model_instance)
        return list(sorted(set(res)))


class TimeStampedModel(models.Model):
    dt_created = AutoCreatedField(_('created'), db_index=True)
    dt_modified = AutoLastModifiedField(_('modified'), db_index=True)

    class Meta:
        abstract = True


class Author(TimeStampedModel, abstract.StateBundleMixin):
    STATE = states.AUTHOR_CHOICES
    name = models.CharField(_('name'), max_length=255, help_text=_('Author real name'))
    dt_birth = models.DateTimeField(_('birth date time'), help_text=_('Select the day of birth'))
    dt_death = models.DateTimeField(_('death date time'), blank=True, null=True)

    biography = models.TextField(_('biography'), blank=True)
    state = models.PositiveSmallIntegerField(_('state'), choices=STATE, default=STATE.alive)

    inspire_source = models.ManyToManyField('self', symmetrical=False, blank=True)

    class Meta:
        verbose_name = _('author')
        verbose_name_plural = _('authors')

    def __str__(self):
        return _('Author {0}').format(self.name)

    def printable_name(self):
        return self.name


class AuthorPhoto(TimeStampedModel):
    author = models.ForeignKey('Author', verbose_name=_('author'))
    photo = ThumbnailerImageField(_('photo'), blank=True, null=True,
                                  help_text=_('logo image'))

    class Meta:
        verbose_name = _('author photo')
        verbose_name_plural = _('author photos')


class Book(TimeStampedModel):
    author = models.ForeignKey('Author', verbose_name=_('author'))
    title = models.CharField(_('title'), max_length=255)
    score = models.DecimalField(_('score'), max_digits=10, decimal_places=4)

    date_published = models.DateField(_('date published'))
    time_published = models.TimeField(_('time published'))

    preview_sample = models.FileField(_('short preview sample'), blank=True)

    sequence = models.PositiveIntegerField(_('author\'s book sequence'), default=0)

    similar_books_ids = PositiveSetField(
        models.PositiveIntegerField(_('similar books IDs'), null=False, validators=[positive_integer_validator]),
        blank=True, default=list
    )

    class Meta:
        verbose_name = _('book')
        verbose_name_plural = _('books')


