from django.http import *
from service.models.author import Author
from service.service_constants import *
from django.views import View

from rest_framework.response import *

from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import json

from rest_framework.views import APIView

from service.serializers.author import AuthorSerializer, MultipleAuthorSerializer

from drf_yasg.utils import swagger_auto_schema

from drf_yasg import openapi

# Create your views here.

class MultipleAuthors(APIView):
    http_method_names = ["get"]

    author_serializer = AuthorSerializer

    ok_response = openapi.Response('Success', MultipleAuthorSerializer)

    @swagger_auto_schema(tags=['Authors'], responses={200: ok_response})
    def get(self, request: HttpRequest, *args, **kwargs):
        authors_queryset = Author.objects.all().order_by('displayName')
        page = request.GET.get('page', 1)
        size = request.GET.get('size', 5)

        paged_authors = Paginator(authors_queryset, size)

        try:
            page = paged_authors.page(page)
        except:
            page = list()

        authors = self.author_serializer(page, many=True).data
        authors = encode_list(authors)

        return Response(authors)

@swagger_auto_schema(request_body=Author)
class SingleAuthor(APIView):
    http_method_names = ["get", "post"]

    author_serializer = AuthorSerializer

    ok_response = openapi.Response('Success', AuthorSerializer)
    not_found = openapi.Response("Author not found")

    @swagger_auto_schema(tags=['Authors'], responses={200: ok_response, 404: not_found})
    def get(self, request, *args, **kwargs):
        self.id = kwargs['author_id']

        try:
            author = Author.objects.get(_id=self.id)
        except:
            author = None

        if not author:
            return Response(status=404)

        author_json = self.author_serializer(author).data

        return Response(author_json)
    
    @swagger_auto_schema(tags=['Authors'], request_body=AuthorSerializer)
    def post(self, request: HttpRequest, *args, **kwargs):
        body = request.body.decode(UTF8)
        body = json.loads(body)

        self.id = kwargs['author_id']

        try:
            author = Author.objects.get(_id=self.id)
        except:
            return HttpResponseNotFound()

        if "displayName" in body:
            author.displayName = body["displayName"]

        if "github" in body:
            author.github = body["github"]

        if "profileImage" in body:
            author.profileImage = body["profileImage"]

        author.save() #updates whatever is set in the above if statements

        author_json = author.toJSON()

        return Response(json.dumps(author_json), status=202, content_type = CONTENT_TYPE_JSON)


def encode_list(authors):
    return {
        "type": "authors",
        "items": authors
    }


