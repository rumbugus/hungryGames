# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-31 16:28
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SelectedPlace',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('place_id', models.CharField(max_length=250)),
                ('place_name', models.CharField(max_length=250)),
                ('nbr_votes', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_description', models.CharField(max_length=250)),
                ('session_time', models.DateField()),
                ('users', models.ManyToManyField(related_name='session', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='selectedplace',
            name='session_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mysessions.Session'),
        ),
    ]