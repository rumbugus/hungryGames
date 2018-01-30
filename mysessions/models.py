from django.db import models, IntegrityError
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Session(models.Model):
	session_description = models.CharField(max_length=250)
	session_time = models.DateField()
	users = models.ManyToManyField(User, related_name ='session')

	def __str__(self):
		return self.session_description

class SelectedPlace(models.Model):
	session_id = models.ForeignKey(Session, on_delete=models.CASCADE)
	place_id = models.CharField(max_length=250)
	place_name = models.CharField(max_length=250)
	nbr_votes = models.IntegerField(default=0)


	def upvote(self, user, session_id):
		try:
			session = Session.objects.get(id=session_id)
			self.place_votes.create(user=user, place=self, session= session, vote_type="up")
			self.nbr_votes += 1
			self.save()                
		except IntegrityError:
			print('already upvoted')
			return 'already_upvoted'
		return 'ok'

	def downvote(self, user, session_id):
		try:
			session = Session.objects.get(id=session_id)
			self.place_votes.create(user=user, place=self, session=session, vote_type="down")
			self.nbr_votes -= 1
			self.save()                
		except IntegrityError:
			print('already downvoted')
			return 'already_downvoted'
		return 'ok'    


class Vote(models.Model):
	user = models.ForeignKey(User, related_name ='user_votes', on_delete=models.CASCADE)
	session = models.ForeignKey(Session, related_name ='session_votes', on_delete=models.CASCADE)
	place = models.ForeignKey(SelectedPlace, related_name ='place_votes', on_delete=models.CASCADE)
	vote_type = models.CharField(max_length = 4, default ='none')

	class Meta:
		unique_together = ('user', 'session', 'place')


#when place added - not appended to the list / subsequent upvote-downvote not displayed