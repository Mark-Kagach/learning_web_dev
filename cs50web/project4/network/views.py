from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import User, Post
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json


def index(request):
    posts = Post.objects.all().order_by('-time')
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page') #i don't understand where he finds page from html.
    # this is just the parameter that is present whenever you use paginator because it has to keep somehow track of the pages.
    page_obj = paginator.get_page(page_number)
    return render(request, "network/index.html", {
        "page_obj": page_obj
    })

@login_required
def new_post(request):
    if request.method == "POST":

        #get data user wants to submit
        owner=request.user
        body=request.POST["body"]

        Post.objects.create(
            owner=owner,
            body=body
        )

        return redirect('index')

def profile(request, account):

    # define a bunch of shit.
    account=User.objects.get(username=account)
    user=request.user
    owner=request.user==account
    following_n=account.following.count()
    followers_n=account.followers.count()
    posts = User.objects.get(username=account).posts.all().order_by('-time')
    paginator=Paginator(posts, 10)
    page_number=request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    #write a bunch of ifs for each case and pass different shit based on it.
    if not user.is_authenticated:
        return render(request, 'network/profile.html', {
            "account": account,
            "following": following_n,
            "followers": followers_n,
            "page_obj":page_obj
        })

    elif owner:
        return render(request, 'network/profile.html', {
            "owner": "owner",
            "account": account,
            "following": following_n,
            "followers": followers_n,
            "page_obj":page_obj
        })
    
    elif request.method=="POST":
        if 'unfollow' in request.POST:
            user.following.remove(account)
            return redirect('profile', account=account.username)
        else:
            user.following.add(account)
            return redirect('profile', account=account.username)

    else:
        follow_b = account not in user.following.all()
        unfollow_b = account in user.following.all()

        return render(request, 'network/profile.html', {
            "follow_b": follow_b,
            "unfollow_b": unfollow_b,
            "account": account,
            "following": following_n,
            "followers": followers_n,
            "page_obj":page_obj
        })

@login_required
def following(request):
    user = request.user
    following_users = user.following.all()
    posts = Post.objects.filter(owner__in=following_users).order_by('-time')
    
    paginator=Paginator(posts, 10)
    page_number=request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/following.html", {
        "page_obj": page_obj
    })

def edit(request, post_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        post = get_object_or_404(Post, id=post_id)

        post.body = data['body']
        post.save()
        return JsonResponse({'body': post.body})

@login_required
def like(request, post_id):

    post = get_object_or_404(Post, id=post_id)

    if request.user in post.likes.all():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked=True
    
    post.save()

    return JsonResponse({'likes': post.likes.count(), 'liked': liked})


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")
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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")