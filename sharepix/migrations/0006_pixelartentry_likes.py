# Generated by Django 3.2.15 on 2022-12-01 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sharepix', '0005_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='pixelartentry',
            name='likes',
            field=models.IntegerField(default=0),
        ),
    ]
