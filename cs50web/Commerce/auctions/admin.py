from django.contrib import admin

# Django Admin Interface: Via the Django admin interface, 
# a site administrator should be able to view, add, edit, 
# and delete any listings, comments, and bids made on the site.

from .models import Comment, Listing, Bid, User

admin.site.register(User)
admin.site.register(Bid)
admin.site.register(Comment)
admin.site.register(Listing)
