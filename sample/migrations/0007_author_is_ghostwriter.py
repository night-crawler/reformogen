# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-05 14:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0006_auto_20171204_1351'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='is_ghostwriter',
            field=models.BooleanField(default=False, verbose_name='Ghostwriter'),
            preserve_default=False,
        ),
    ]
