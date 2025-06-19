from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

# You will also need to add additional models to this file to represent details 
# about auction listings, bids, comments, and auction categories. 
# Remember that each time you change anything in auctions/models.py, 
# you’ll need to first run python manage.py makemigrations and then 
# python manage.py migrate to migrate those changes to your database.

# Auction listings
    # photo url
    # name
    # initial price
    # category
    # comments
    # description
class Listing(models.Model):
    CATEGORIES = [
        ('b', 'Books'),
        ('e', 'Essays'),
        ('p', 'Papers'),
        ('l', 'Lectures'),
    ]

    name = models.CharField(max_length=64)
    photo = models.URLField()
    price = models.PositiveIntegerField()
    description = models.TextField(max_length=600)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    category = models.CharField(max_length=1, choices=CATEGORIES)
    active = models.BooleanField(default=True)
    best_bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="best_bidder", null=True, blank=True)
    watchlisted_users = models.ManyToManyField(User, related_name="watchlisted_listings", blank=True)

    # not sure about this reverse name, and whether we need it at all. Nor, how to implement it well.
    #comments = models.ForeignKey(Comments, on_delete=models.CASCADE, related_name="listings")

    # JUST UPDATE THE PRICE IF THE BID IS HIGHER
    #best_bid = models.ForeignKey(Bids, on_delete=models.CASCADE)
    #best_bid_owner = models.ForeignKey(Bids, on_delete=models.CASCADE)

# comments
    # who 
    # what
    # when?
class Comment(models.Model):
    time = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.CharField(max_length=400)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='comments')

# bids
    # amount
    # who
    # which listing
class Bid(models.Model):
    bid = models.PositiveIntegerField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")
    time = models.DateTimeField(auto_now_add=True)