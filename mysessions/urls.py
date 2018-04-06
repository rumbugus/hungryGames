from django.conf.urls import url 
from django.contrib import admin 

from . import views 
#from django.contrib.auth import login

from django.contrib.auth.views import login

app_name = 'mysessions'

urlpatterns= [
	url(r'^$', views.index, name ='index'),
#make href = to the google id of the place; when place clicked, i
#nstead of defailsview, use something similar to addalbum
	#url(r'^(?P<pk>[0-9]+)/$', views.DetailView.as_view(), name='detail'),
	url(r'^(?P<session_id>[0-9]+)/$', views.session, name='session'),
	url(r'^(?P<session_id>[0-9]+)/add/$', views.addPlace, name='addPlace'),
	url(r'^(?P<session_id>[0-9]+)/down/$', views.downvote, name='downVote'),
	url(r'^(?P<session_id>[0-9]+)/up/$', views.upvote, name='upVote'),
	url(r'^(?P<session_id>[0-9]+)/getSelectedList/$', views.getSelectedPlaces, name='getPlaces'),
	url(r'^(?P<session_id>[0-9]+)/getWinner/$', views.getWinner, name='getWinner'),


#	url(r'^login/$', views.login_view)

	#url(r'^login/$', login, {'template_name': 'mysessions/login.html'})

	#url(r'^(?P<session_id>[0-9]+)/vote(?P<vote_sense>(?:up|down))/$', views.vote, name='votePlace')

]