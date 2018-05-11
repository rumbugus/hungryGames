from .models import SelectedPlace, Session, Vote
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader 
from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
import datetime
import pytz
from django.db.models import Max
import json
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect





from django.contrib.auth import (
	authenticate,
	get_user_model,
	login,
	logout
)

from django.shortcuts import render 

from .forms import UserLoginForm

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            login(request, user)
            return HttpResponseRedirect("mysessions/sessions.html")
        return HttpResponseRedirect("/account/invalid/")
    form = UserLoginForm()
    return render(request, 'mysessions/login.html', {'login_form': UserLoginForm})


@login_required(login_url='/login')
def session(request, session_id):
	selected_places = SelectedPlace.objects.all()
	session_descr = Session.objects.get(pk=session_id).session_description
	session_time = Session.objects.get(pk=session_id).session_time
	time_remaining = Session.objects.get(pk=session_id).get_time_diff()

	template = loader.get_template('mysessions/session.html')
	context ={
		'selected_places':selected_places,
		'session_descr': session_descr,
		'session_time': session_time,
		'time_remaining':time_remaining
	}

	return HttpResponse(template.render(context,request))

#create if to add points instead of adding a line 
def addPlace(request, session_id):
	print("start")
	if request.method == 'POST':
		place_id = request.POST['place_id']
		num_results = SelectedPlace.objects.filter(place_id = place_id, session_id=session_id).count()
		place_name = request.POST['place_name']

		if num_results == 0:
			print("place not in the list")
			SelectedPlace.objects.create(
				session_id = Session.objects.get(pk=session_id),
				place_id = place_id,
				place_name = place_name,
				nbr_votes = 0
				)
			print("place created")
		else:
			print("place in the list")

		return HttpResponse()

def downvote(request, session_id):
	if request.method == 'POST':
		place_id = request.POST['place_id']
		real_session_id = Session.objects.get(pk=session_id)
		place = SelectedPlace.objects.get(session_id_id='1', place_id="ChIJoYK-GnYZyUwRLdfmsIrFRWE") 
		user = request.user 

		place.save()
		place.downvote(user, session_id)

	return HttpResponse()


def upvote(request, session_id):
	if request.method == 'POST':

		place = get_object_or_404(SelectedPlace, place_id=request.POST['place_id'], session_id=session_id) 

		user = request.user 

		place.upvote(user, session_id)

	return HttpResponse()

				

#include vote_type
def getSelectedPlaces(request, session_id):
	session = Session.objects.get(pk=session_id)

 	places = SelectedPlace.objects.filter(session_id=session_id).values_list('place_name', 'place_id', 'nbr_votes')
 	#votes = Vote.objects.filter(session_id=session_id).values_list('place_name', 'place_id', 'nbr_votes')
 	response_data = {}
 	data = list(places)

	try:
		response_data['result'] = 'Success'
		response_data['message'] = data
	except:
		response_data['result'] = 'Oh NO!'
		response_data['message'] = 'Subprocess did not script correctly'
	return HttpResponse(json.dumps(response_data), content_type="applicaiton/json")


@login_required(login_url='/login')
def index(request):

	#sessions = Session.objects.al()
	##filter only sessions to which the user is invited
	sessions = Session.objects.filter(users= request.user)
	template = loader.get_template('mysessions/index.html')

	context = {
		'sessions':sessions
	}

	return HttpResponse(template.render(context, request))



def getWinner(request, session_id):

	session = Session.objects.get(id=session_id)

	winner = Session.whoWon(session)

	response_data ={}

	#data = list(winner)
	print(winner)

	try:
		response_data['result'] = 'Success'
		response_data['message'] = winner
	except:
		response_data['result'] = 'Oh NO!'
		response_data['message'] = 'Subprocess did not script correctly'
	return HttpResponse(json.dumps(response_data), content_type="applicaiton/json")



	##if multiple, then pick one at random 