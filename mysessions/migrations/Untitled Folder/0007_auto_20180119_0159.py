# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-19 01:59
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mysessions', '0006_auto_20180119_0124'),
    ]

    operations = [
        migrations.RenameField(
            model_name='selectedplace',
            old_name='nbr_votes',
            new_name='votes',
        ),
    ]
