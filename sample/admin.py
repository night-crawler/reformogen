from django.contrib import admin

from .models import Author, AuthorPhoto, Book


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'dt_created',
        'dt_modified',
        'name',
        'dt_birth',
        'dt_death',
        'biography',
        'state',
    )
    list_filter = ('dt_created', 'dt_modified', 'dt_birth', 'dt_death')
    raw_id_fields = ('inspire_source',)
    search_fields = ('name',)


@admin.register(AuthorPhoto)
class AuthorPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'dt_created', 'dt_modified', 'author', 'photo')
    list_filter = ('dt_created', 'dt_modified', 'author')


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'dt_created',
        'dt_modified',
        'author',
        'title',
        'score',
        'date_published',
        'time_published',
        'preview_sample',
        'sequence',
        'similar_books_ids',
    )
    list_filter = ('dt_created', 'dt_modified', 'author', 'date_published')
