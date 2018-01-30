from django.shortcuts import render
from django.contrib.auth import (
	authenticate,
	get_user_model,
	login,
	logout,
	)

from django import forms 

User = get_user_model()

class UserLoginForm(forms.Form):
	username = forms.CharField()
	password = forms.CharField(widget=forms.PasswordInput)

	def clean(self):
		username = self.cleaned_data.get("username")
		password = self.cleaned_data("password")
		user = authenticate(username=username, password=password)
		if not user:
			raise forms.ValidationError("This user does not exist")

		if not user.check_password(password):
			raise forms.ValidationError("Wrong password")

		if not user.is_active:
			raise forms.ValidationError("This user is no longer active")
		
		return super(UserLoginForm, self).clean(*args, **kwargs)
