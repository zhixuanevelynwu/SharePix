from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, Http404
from django.urls import reverse

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.core.files.base import ContentFile
from django.utils.encoding import uri_to_iri

from django.utils import timezone
import json
import base64

from sharepix.models import *
from sharepix.forms import *

import random
import string

# Renders the pixel art creation page 
@login_required
def create(request):
    context = {}
    return render(request, 'sharepix/create.html', context)

# Renders the artist profile page
@login_required
def profile(request):
    # First time log in -> create a profile if does not exist
    if not Profile.objects.filter(user=request.user):
        user_profile = Profile(user = request.user)
        user_profile.save()
        
    # Fetch user profile
    user_profile = Profile.objects.filter(user=request.user)[0]

    # get all pixel art entries
    my_pixel_arts = PixelArtEntry.objects.all().filter(user=request.user).order_by("created").reverse()
    print(my_pixel_arts)

    # For GET requests, simply render the page
    if request.method == 'GET':
        context = {'profile': user_profile, 'form': ProfileForm(initial={'bio': user_profile.bio}), 'my_pixel_arts': my_pixel_arts}
        return render(request, 'sharepix/profile.html', context)

    # For POST requests, create a form based on the updated input
    form = ProfileForm(request.POST, request.FILES)

    # If form is invalid, do not update profile data
    if not form.is_valid():
        return render(request, 'sharepix/profile.html', {'profile': user_profile, 'form': form, 'my_pixel_arts': my_pixel_arts})

    # Otherwise, save updates to the database
    user_profile.bio = form.cleaned_data['bio']
    if form.cleaned_data['picture']:
        user_profile.picture = form.cleaned_data['picture']
        user_profile.content_type = form.cleaned_data['picture'].content_type
    user_profile.save()
    return render(request, 'sharepix/profile.html', {'profile': request.user.profile, 'my_pixel_arts': my_pixel_arts, 'form': form})

# Renders the artist profile page
@login_required
def other(request, id):
    # Find the requested user profile
    request_user = User.objects.filter(id=id)[0]
    user_profile = Profile.objects.filter(user=request_user)[0]

    # If dne, raise 404 status
    if not user_profile:
        raise Http404

    # get all pixel art entries
    my_pixel_arts = PixelArtEntry.objects.all().filter(user=request_user).order_by("created").reverse()
    print(my_pixel_arts)
    return render(request, 'sharepix/other.html', {'profile': user_profile, 'my_pixel_arts': my_pixel_arts})
    
# Fetches the requested profile
@login_required
def get_profile(request, id):
    if id == request.user.id:
        return profile(request)
    else:
        return other(request, id)

# Get the profile picture
def profile_picture(resquest, id):
    item = get_object_or_404(Profile, id=id)
    print('Picture #{} fetched from db: {} (type={})'.format(id, item.picture, type(item.picture)))

    # Maybe we don't need this check as form validation requires a picture be uploaded.
    # But someone could have delete the picture leaving the DB with a bad references.
    if not item.picture:
        raise Http404

    return HttpResponse(item.picture, content_type=item.content_type)

# Renders the social feed page
@login_required
def socialfeed(request):
    # First time log in -> create a profile if does not exist
    if not Profile.objects.filter(user=request.user):
        user_profile = Profile(user = request.user)
        user_profile.save()

    arts = PixelArtEntry.objects.all().order_by("created").reverse()
    context = {"arts": arts}

    return render(request, 'sharepix/socialfeed.html', context)

# Helper function to throw an error message
def _my_json_error_response(message, status=200):
    response_json = '{ "error": "' + message + '" }'
    return HttpResponse(response_json, content_type='application/json', status=status)

# Publish artworks
@login_required
def publish(request):
    if not request.user.id:
        return _my_json_error_response("You must be logged in to do this operation", status=401)

    if request.method != 'POST':
        return _my_json_error_response("You must use a POST request for this operation", status=405)

    if not 'art' in request.POST:
        return _my_json_error_response("Missing field", status=400)

    if request.POST['art'] == '':
        return _my_json_error_response("Invalid field", status=400)
    
    # https://stackoverflow.com/questions/39576174/save-base64-image-in-django-file-field
    # Create a file
    data = uri_to_iri(request.POST['art'])

    format, imgstr = data.split(';base64,')
    ext = format.split('/')[-1] 
    data = ContentFile(base64.b64decode(imgstr), name= ''.join(random.choices(string.ascii_lowercase, k=20)) + '.' + ext)

    new_item = PixelArtEntry(user=request.user, 
                            created = timezone.localtime(timezone.now()),
                            art=data)
    new_item.save()
    return HttpResponse({}, content_type='application/json')

# Like artworks
@login_required
def like(request):
    if not request.user.id:
        return _my_json_error_response("You must be logged in to do this operation", status=401)

    if request.method != 'POST':
        return _my_json_error_response("You must use a POST request for this operation", status=405)

    if not 'liked' in request.POST:
        return _my_json_error_response("Missing field", status=400)

    if not 'pid' in request.POST:
        return _my_json_error_response("Missing field", status=400)

    liked = request.POST['liked']
    pid = int(request.POST['pid'])
    art_work = PixelArtEntry.objects.all().filter(id=pid)[0]

    if liked == 'true':
        art_work.likes = art_work.likes + 1
    elif liked == 'false':
        art_work.likes = art_work.likes - 1

    art_work.save()
    response_data = {
        'id': art_work.id,
        'likes': art_work.likes
    }
    response_json = json.dumps(response_data)
    return HttpResponse(response_json, content_type='application/json')

def published_art(resquest, id):
    item = get_object_or_404(PixelArtEntry, id=id)
    print('Picture #{} fetched from db: {} (type={})'.format(id, item.art, type(item.art)))

    if not item.art:
        raise Http404

    return HttpResponse(item.art, content_type='image/png')

# Follow or unfollows an artist
def follow_toggle(request, id):
    # Fetch user profile
    user_profile = Profile.objects.filter(user=request.user)[0]
    current_user = User.objects.get(id=id)
    following = user_profile.following.all()

    if current_user in following:
        user_profile.following.remove(current_user)
        user_profile.save()
    else: 
        user_profile.following.add(current_user)
        user_profile.save()
    
    return get_profile(request, id)


# Get the profile picture
def other_profile_picture(resquest, id):
    item = get_object_or_404(Profile, id=id)
    print('Picture #{} fetched from db: {} (type={})'.format(id, item.picture, type(item.picture)))

    # Maybe we don't need this check as form validation requires a picture be uploaded.
    # But someone could have delete the picture leaving the DB with a bad references.
    if not item.picture:
        raise Http404

    return HttpResponse(item.picture, content_type=item.content_type)
