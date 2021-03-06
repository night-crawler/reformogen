# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-04 13:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0005_auto_20171122_0923'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='allmodelfields',
            options={'ordering': ('id',), 'verbose_name': 'all model fields', 'verbose_name_plural': 'list of all model fields instances'},
        ),
        migrations.AlterModelOptions(
            name='author',
            options={'ordering': ('id',), 'verbose_name': 'author', 'verbose_name_plural': 'authors'},
        ),
        migrations.AlterModelOptions(
            name='authorphoto',
            options={'ordering': ('id',), 'verbose_name': 'author photo', 'verbose_name_plural': 'author photos'},
        ),
        migrations.AlterModelOptions(
            name='book',
            options={'ordering': ('id',), 'verbose_name': 'book', 'verbose_name_plural': 'books'},
        ),
        migrations.AddField(
            model_name='author',
            name='favorite_book',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='sample.Book'),
        ),
        migrations.AlterField(
            model_name='author',
            name='dt_birth',
            field=models.DateTimeField(default=django.utils.timezone.now, help_text='Select the day of birth', verbose_name='birth date time'),
        ),
        migrations.AlterField(
            model_name='author',
            name='dt_death',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True, verbose_name='death date time'),
        ),
    ]
