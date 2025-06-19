from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .models import User
from .models import Listing
from .models import Comment
from .models import Bid

def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all()
    })
#make sure to show only active listings.


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


@login_required
def create(request):

    if request.method == "POST":
        name = request.POST["name"]
        description = request.POST["description"]
        photo = request.POST["photo"]
        price = request.POST["price"]
        category = request.POST["category"]

        # add to our database/ model
        #HOW TO MANIPULATE DB FROM VIEWS.PY
        new_listing = Listing.objects.create(
            name=name, 
            description=description, 
            photo=photo if photo else None, 
            price=price, 
            category=category if category else None,
            owner=request.user
        )

        return redirect('listing', listing_id=new_listing.id)
        # redirect to the created listing 
            # add user_id as a variable
    
    else:
        return render(request, "auctions/create.html")

def get_category_display(self):
        return dict(Listing.CATEGORIES).get(self.category)

# add listing id later
def listing(request, listing_id):
    listing = Listing.objects.get(id=listing_id)
    # how do I get the logged in user

    if request.user.is_authenticated:

        user = request.user
        owner=request.user==listing.owner

        if request.method =="POST":

            # & submitted form is the bidding form
            if 'bid_form' in request.POST:
                # the submitted price should be the new listing.price
                price = int(request.POST.get("price"))
                            
                listing.price=price
                listing.best_bidder=user
                
                listing.save()

                return render(request, 'auctions/listing.html', {
                    "listing": listing
                })

            if 'comment_form' in request.POST:
                comment = request.POST.get("comment")
                
                Comment.objects.create( 
                    owner=user,
                    listing=listing,
                    comment=comment
                )

                return render(request, 'auctions/listing.html', {
                    "listing": listing
                })

            if 'watchlist_form' in request.POST:
                
                #Add/remove from the watchlist

                #if user is not in listing.watchlisted_users
                if not listing.watchlisted_users.filter(id=request.user.id).exists():
                    listing.watchlisted_users.add(request.user)
                else:
                    listing.watchlisted_users.remove(request.user)

                return redirect('watchlist')
            
            if 'closing_form' in request.POST:

                #switch the active to passive
                listing.active=False
                #change the owner
                listing.owner=listing.best_bidder
                listing.save()

                #pass the message of the winner
                return render(request, 'auctions/listing.html', {
                    "message": f"{listing.best_bidder} won the auction!",
                    "listing": listing, 
                    "owner": owner
                })
        else:
            if listing.best_bidder==listing.owner:
                return render(request, 'auctions/listing.html', {
                    "listing": listing,
                    "message": f"Congratulations for fucking winning the fucking listing for fucking {listing.price}$!!1!!1!11!!!"
                })
            elif user==listing.owner:
                return render(request, 'auctions/listing.html', {
                    "listing": listing,
                    "owner": owner
                })
            else:
                return render(request, 'auctions/listing.html', {
                    "listing": listing
                })
    else:
        return render(request, 'auctions/listing.html', {
            "message": "Sign in to bid and comment!",
            "listing": listing
        })


#add comments to every rendering?, {
#        "listings": Listing.objects.all()
#    })


@login_required
def watchlist(request):

    listings = Listing.objects.filter(watchlisted_users=request.user)

    return render(request, 'auctions/watchlist.html', {
        "listings": listings
    })

def categories(request, category):

    listings = Listing.objects.filter(category=category)

    return render(request, 'auctions/categories.html', {
        "listings": listings,
        "category": category
    })