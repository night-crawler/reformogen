# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-27 13:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0002_author_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='inspire_source',
            field=models.ManyToManyField(blank=True, to='sample.Author'),
        ),
    ]
