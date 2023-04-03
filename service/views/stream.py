import json

from django.db.models import Q
from django.http import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from service.models.author import Author
from service.models.inbox import Inbox
from service.models.post import Post
from service.service_constants import *
from service.views.post import filter_posts

import service.services.team_10.authors as team_10


#returns an author's stream
class ObjectNotFound:
    pass


class AuthorStream(APIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        author_id = kwargs['author_id']

        try:
            author = Author.objects.get(_id=author_id, is_active=True)
        except:
            author = None

        if request.user.username != author.user.username:
            author = None

        if not author:
            return HttpResponseNotFound()

        # get posts in inbox and user posts

        #get list of following
        #following = Author.objects.all().filter(followers___id__contains=author._id)
        posts_json = list()

        posts = Post.objects.all()\
            .filter(author__in=following)\
            .filter(visibility="PUBLIC")\
            .union(
                Post.objects.all().filter(author___id=author._id).filter(visibility="PUBLIC")
            ).order_by('-published')

        for post in posts:
            if post.unlisted:
                continue
            if post.author != author and not is_friend(post.author, author):
                continue
            posts_json.append(post.toJSON())

        return HttpResponse(json.dumps(posts_json), content_type=CONTENT_TYPE_JSON)

def is_friend(author1: Author, author2: Author):
    return author1 in list(author2.followers.all()) and author2 in list(author1.followers.all())

def encode_list(authors):
    return {
        "type": "author",
        "items": authors
    }


