from django import forms
from django.contrib.auth.models import User
from sharepix.models import *
from django.contrib.auth import authenticate

MAX_UPLOAD_SIZE = 2500000

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('picture', 'bio')
        widgets = {
            'picture': forms.FileInput(attrs={'id': 'id_upload_image'}),
            'bio': forms.Textarea(attrs={'id': 'id_bio_input_text', 'rows': '3'})
        }
        labels = {
            'picture': "Upload image",
            'bio': "",
        }

        
