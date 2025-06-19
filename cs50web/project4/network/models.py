from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('self', symmetrical=False,  related_name="followers")

class Post(models.Model):
    time= models.DateTimeField(auto_now_add=True)
    body = models.TextField(max_length=600)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts" )
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

#post.owner = User and to find its username we have to look inside it => post.owner.username
# AND IN INDEX views case the urls expects A STRING, NOT AN OBJECT, WHICH POST.OWNER IS. Following doesn't expect a string.;