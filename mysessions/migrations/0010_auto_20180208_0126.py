# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-02-08 01:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mysessions', '0009_auto_20180131_0140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='session_time',
            field=models.DateTimeField(),
        ),
    ]
