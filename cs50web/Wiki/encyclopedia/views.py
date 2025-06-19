from django.shortcuts import render, redirect
from . import util
import markdown2
import random


def index(request):

    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })
#add links to all pages

#do I need to create a separate route for each page? Or could I nest them under wiki?
def wiki(request, title):

    entry=util.get_entry(title)

    if entry is None:
        return render(request, "encyclopedia/error.html")
        #return the page again with error? or create error.html and return it everytime?
    else:
        content = markdown2.markdown(entry)

        return render(request, "encyclopedia/page.html", {
            "title": title,
            "content": content
        })

def search(request):
    # don't understand/ need to learn this line. request I get, .GET I kind of get,
    # and then I assume the .GET has other function/ variables I can take in from it, one of
    # which is .get to get whatever is in the .GET
    query = request.GET.get("q")

    # Check for a match using util.get_entry(title)

    if util.get_entry(query):
        #redirect to wiki so it renders the query page (i reimplemented wiki page in here, needless repetition.)
        return redirect("wiki", title=query)
        
        '''
        #1. get the page's content
        # I don't get what is his problem with this line.
        entry = util.get_entry(query)
        content=markdown2.markdown(entry)

        #2. render the page
        return render(request, "encyclopedia/page.html", {
            "title": query,
            "content": content
        })
        '''
    else: 
    # No direct match is found
    # Look for similar entries
    # Display them on a search page

    #1. create a list of entries to show
        entries=[]

    #2. fill it in with matching entries
        #loop through each string in list_entries
        for result in util.list_entries():
            #compare each entry with the query
            if query.lower() in result.lower():
                # append item to matching_results
                entries.append(result)           
        
    #3. display error if none.
        if not entries:
            return render(request, "encyclopedia/error.html")

    #4. pass the list to search page 
        else:
            return render(request, "encyclopedia/search.html", {
                "query": query,
                "entries": entries
            })

def create(request):
    if request.method=="POST":
        #get what they want to post
        title = request.POST.get("title")
        description = request.POST.get("description")

        #check whether the page name is taken or not
        if title.lower() in [entry.lower() for entry  in util.list_entries()]:
            #show error
            return render(request, "encyclopedia/create.html", {
                "error": "This page already exists!"
            })
        else:
            util.save_entry(title=title, content=description)
            #create the page
            #redirect them to wiki with the page title
            return redirect("wiki", title=title)

    else:
        
        return render(request, "encyclopedia/create.html")

def edit(request, title):
    if request.method == "POST":
        # Get the updated content from the form submission
        content = request.POST.get("content")
        title = request.POST.get("title")

        # Save the updated content (raw markdown) back to the file
        util.save_entry(title=title, content=content)

        # Redirect to the page with the updated content
        return redirect("wiki", title=title)

    else:
        # Fetch the raw markdown content (not HTML) for pre-populating the form
        entry = util.get_entry(title)

        return render(request, "encyclopedia/edit.html", {
            "title": title,
            "content": entry  # Pass raw markdown content here
        })

def randomy(request):
    r = random.randint(0, len(util.list_entries())-1)

    entries = util.list_entries()

    title = entries[r]

    return redirect("wiki", title=title)