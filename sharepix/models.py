from django.db import models
from django.contrib.auth.models import User

# python manage.py makemigrations
# python manage.py migrate
# python manage.py shell 
# from sharepix.models import *
# PixelArtEntry.objects.all()
# PixelArtEntry.objects.all().delete()
class Profile(models.Model):
    bio = models.CharField(max_length=200, default="...")
    user = models.OneToOneField(User, default=None, on_delete=models.PROTECT)
    picture = models.FileField(blank=True)
    content_type = models.CharField(max_length=50)
    following = models.ManyToManyField(User, related_name="following", blank=True)

    def __str__(self):
        return f'id={self.id}'

class PixelArtEntry(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
    created = models.DateTimeField()
    art = models.FileField()
    likes = models.IntegerField(default=0)
 
    def __str__(self):
        return f'id={self.id}'
