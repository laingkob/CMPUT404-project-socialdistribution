# Generated by Django 3.2 on 2023-03-24 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0005_auto_20230310_0154'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='host',
            field=models.URLField(blank=True, default='https://social-distribution-w23-t17.herokuapp.com'),
        ),
        migrations.AlterField(
            model_name='follow',
            name='actor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actor', to='service.author'),
        ),
        migrations.AlterField(
            model_name='follow',
            name='object',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='object', to='service.author'),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='comments',
            field=models.ManyToManyField(blank=True, to='service.Comment'),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='follow_requests',
            field=models.ManyToManyField(blank=True, to='service.Follow'),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='likes',
            field=models.ManyToManyField(blank=True, to='service.Like'),
        ),
        migrations.AlterField(
            model_name='inbox',
            name='posts',
            field=models.ManyToManyField(blank=True, to='service.Post'),
        ),
    ]
