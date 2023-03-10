from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from service.service_constants import *
from django.http import *
import json
from datetime import datetime, timezone
from service.services.rest_service import RestService
import uuid

from rest_framework.views import APIView
from rest_framework.response import *

from service.models.comment import Comment
from service.models.post import Post
from service.models.author import Author
from django.core.exceptions import ObjectDoesNotExist

from service.serializers.comment import CommentSerializer, PagedCommentSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@method_decorator(csrf_exempt, name='dispatch')
class CommentView(APIView, RestService):
    http_method_names = ["get", "post"]

    comment_serializer = CommentSerializer

    ok_response = openapi.Response('Success', PagedCommentSerializer)
    @swagger_auto_schema(tags=['Comments'], responses={200: ok_response})
    def get(self, request, *args, **kwargs):
        self.author_id = kwargs['author_id']
        self.post_id = kwargs['post_id']

        try:
            Post.objects.get(_id=self.post_id)
        except ObjectDoesNotExist:
            return HttpResponseNotFound()

        page = request.GET.get('page', 1)
        size = request.GET.get('size', 5)

        comment_queryset = Comment.objects.all().filter(post=self.post_id).order_by('-published')

        host = request.build_absolute_uri('/') #gets the base of the host -> http://localhost:8000

        paged_comments = Paginator(comment_queryset, size)

        try:
            comment_page = paged_comments.page(page) #default to page 1
        except:
            comment_page = list()

        comments = self.comment_serializer().data

        comments_json = encode_list(comments, host, page, size, self.author_id, self.post_id)

        return Response(json.dumps(comments_json), content_type = CONTENT_TYPE_JSON)

    ok_response = openapi.Response('Success', PagedCommentSerializer)   

    @swagger_auto_schema(tags=['Comments'], responses={200: ok_response}, request_body=CommentSerializer, detail=True)
    def post(self, request, *args, **kwargs):
        self.author_id = kwargs['author_id']
        self.post_id = kwargs['post_id']

        try:
            post = Post.objects.get(_id=self.post_id)
            author = Author.objects.get(_id=self.author_id)
        except:
            return HttpResponseNotFound()

        body = request.body.decode(UTF8)
        body = json.loads(body)

        comment = Comment()

        try:
            comment._id = Comment.create_comment_id(self.author_id, self.post_id)
            comment.comment = body["comment"]
            comment.author = author
            comment.post = post

            is_valid = self.valid_choice(body["contentType"], Comment.CONTENT_TYPES)

            if not is_valid:
                return HttpResponseBadRequest()

            comment.contentType = body["contentType"]
            comment.published = datetime.now(timezone.utc)

        except KeyError:
            return HttpResponseBadRequest()

        comment.save()

        comment_json = comment.toJSON()

        return HttpResponse(json.dumps(comment_json), status=201, content_type = CONTENT_TYPE_JSON)

def encode_list(comments, host, page, size, author_id, post_id):
    return {
        "type": "comments",
        "page": int(page),
        "size": int(size),
        "post": f"{host}authors/{author_id}/posts/{post_id}",
        "id": f"{host}authors/{author_id}/posts/{post_id}/comments",
        "items": comments
    }