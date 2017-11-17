from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.timezone import now
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
        ordering = ('author', 'title')

    def printable_name(self):
        return self.title


def default_date():
    return now().date()


def default_time():
    return now().time()


class AllModelFields(models.Model):
    STATE = states.AUTHOR_CHOICES

    f_date = models.DateField(_('date'), default=default_date)
    f_time = models.TimeField(_('time'), default=default_time)
    f_dt = models.DateTimeField(_('date and time'), default=now)

    f_integer = models.IntegerField(_('integer'), default=-22)
    f_positive_integer = models.PositiveIntegerField(_('positive integer'), default=0)
    f_small_integer = models.SmallIntegerField(_('small integer'), default=13)
    f_positive_small_integer = models.PositiveSmallIntegerField(_('positive small integer'), default=222)

    f_decimal = models.DecimalField(_('decimal'), max_digits=10, decimal_places=4, default=3.1415)
    f_float = models.FloatField(_('float'), default=3.14)

    f_fk_embed = models.ForeignKey(Author,
                                   verbose_name=_('embedded foreign key'), blank=True, null=True, related_name='+')
    f_fk_rel = models.ForeignKey(Book,
                                 verbose_name=_('foreign key with relation'), blank=True, null=True, related_name='+')

    f_m2m_embed = models.ManyToManyField(Author, verbose_name=_('embedded M2M'), blank=True, related_name='+')
    f_m2m_rel = models.ManyToManyField(Author, verbose_name=_('related M2M'), blank=True, related_name='+')

    f_choice = models.PositiveSmallIntegerField(_('choice'), choices=STATE, default=STATE.alive)

    f_file = models.FileField(_('short preview sample'), blank=False)
    f_photo = ThumbnailerImageField(_('photo'), blank=True, null=True, help_text=_('logo image'))

    f_char_field = models.CharField(_('char field'), max_length=255, help_text=_('charfield'))
    f_text_field = models.TextField(_('text field'), blank=True)

    class Meta:
        verbose_name = _('all model fields')
        verbose_name_plural = _('list of all model fields instances')

    def __str__(self):
        return self.printable_name()

    def printable_name(self):
        return '{0.id}: {0.f_char_field}'.format(self)
