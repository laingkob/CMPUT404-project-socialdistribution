import json

from django.core.paginator import Paginator
from django.db.models import Q
from django.http import *
from django.views import View

from service.models.author import Author
from service.models.post import Post
from service.service_constants import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import requests

#returns an author's stream
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

        #get list of following
        following = Author.objects.all().filter(followers___id__contains=author._id)

        posts_json = list()

        #needs visibility filtering.
        posts = Post.objects.all().filter(author__in=following).order_by('-published')

        for post in list(posts):
            posts_json.append(post.toJSON())

        return HttpResponse(json.dumps(posts_json), content_type=CONTENT_TYPE_JSON)

def encode_list(authors):
    return {
        "type": "author",
        "items": authors
    }


