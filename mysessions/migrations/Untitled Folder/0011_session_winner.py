# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-02-11 20:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mysessions', '0010_auto_20180208_0126'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='winner',
            field=models.CharField(default='none', max_length=250),
            preserve_default=False,
        ),
    ]