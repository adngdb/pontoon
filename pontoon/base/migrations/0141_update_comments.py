# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-12-07 14:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0140_add_comments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='translation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='base.Translation'),
        ),
    ]
