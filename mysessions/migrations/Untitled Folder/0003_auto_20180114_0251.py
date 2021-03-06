# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-14 02:51
from __future__ import unicode_literals

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('mysessions', '0002_selectedplace_users_voted'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserVotes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_vote', models.IntegerField(default=1, validators=[django.core.validators.MaxValueValidator(1), django.core.validators.MinValueValidator(-1)])),
            ],
        ),
        migrations.RemoveField(
            model_name='selectedplace',
            name='users_voted',
        ),
        migrations.AddField(
            model_name='uservotes',
            name='place_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mysessions.SelectedPlace'),
        ),
        migrations.AddField(
            model_name='uservotes',
            name='users',
            field=models.ManyToManyField(related_name='placeVote', to=settings.AUTH_USER_MODEL),
        ),
    ]
