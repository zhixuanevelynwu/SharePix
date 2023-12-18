from django.urls import path
from . import views

urlpatterns = [
    path('', views.socialfeed, name='socialfeed'),
    path('create', views.create, name='create'),
    path('profile', views.profile, name='profile'),
    path('sharepix/publish-work', views.publish, name='ajax-publish'),
    path('sharepix/like-work', views.like, name='ajax-like'),
    path('published_art/<int:id>', views.published_art, name='published_art'),
    path('profile_picture/<int:id>', views.profile_picture, name='profile_picture'),
    path('follow_toggle/<int:id>', views.follow_toggle, name="follow_toggle"), 
    path('other_profile_picture/<int:id>', views.other_profile_picture, name='other_profile_picture'),
    path('get_profile/<int:id>', views.get_profile, name='get_profile'),
]
