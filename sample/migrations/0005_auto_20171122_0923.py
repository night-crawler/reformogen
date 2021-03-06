# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-22 09:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0004_auto_20171115_1143'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='book',
            options={'ordering': ('author', 'title'), 'verbose_name': 'book', 'verbose_name_plural': 'books'},
        ),
        migrations.AddField(
            model_name='allmodelfields',
            name='f_char_field',
            field=models.CharField(default='test', help_text='charfield', max_length=255, verbose_name='char field'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='allmodelfields',
            name='f_text_field',
            field=models.TextField(blank=True, verbose_name='text field'),
        ),
        migrations.AlterField(
            model_name='allmodelfields',
            name='f_file',
            field=models.FileField(upload_to='', verbose_name='short preview sample'),
        ),
    ]
