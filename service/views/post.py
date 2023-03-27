import json
from datetime import datetime, timezone

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.http import *
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

from service.models.author import Author
from service.models.post import Post, Category
from service.service_constants import *
from service.services import team_14, team_22, team_16
from service.services.rest_service import RestService
from rest_framework.permissions import IsAuthenticated


# endpoints with just author_id
@method_decorator(csrf_exempt, name='dispatch')
class PostCreation(APIView, RestService):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

    def get(self, request: HttpRequest, *args, **kwargs):  # get all recent posts for author_id
        author_id = kwargs['author_id']
        try:
            author = Author.objects.get(_id=author_id)
        except ObjectDoesNotExist:
            return HttpResponseNotFound()

        page = request.GET.get('page', 1)
        size = request.GET.get('size', 5)

        # fetch remote posts for the author if they are marked as remote

        # remote-user-t14
        if author.host == settings.REMOTE_USERS[0][1]:
            team_14.get_multiple_posts(author)

        # remote-user-t22
        if author.host == settings.REMOTE_USERS[1][1]:
            team_22.get_multiple_posts(author)

        # remote-user-t16
        if author.host == settings.REMOTE_USERS[2][1]:
            team_16.get_multiple_posts(author, page, size)

        posts = list()

        post_queryset = Post.objects.all().filter(author=author_id).order_by('-published')  # only get posts from author_id in the URL, order by the published date
        paged_posts = Paginator(post_queryset, size or 5)  # default to size 5

        try:
            page = paged_posts.page(page or 1)  # default to page 1
        except:
            page = list()

        for post in page:
            posts.append(post.toJSON())

        posts_json = encode_list(posts)

        return HttpResponse(json.dumps(posts_json), content_type=CONTENT_TYPE_JSON)

    def post(self, request: HttpRequest, *args, **kwargs):  # create a new post
        if request.content_type != CONTENT_TYPE_JSON:
            return HttpResponseBadRequest()
        try:
            body = request.data
        except AttributeError:  # tests don't run without this
            body = request.body
            body = json.loads(body)

        author_id = kwargs['author_id']

        post = Post()

        try:
            author = Author.objects.get(_id=author_id, is_active=True)
        except ObjectDoesNotExist:
            return HttpResponseNotFound()

        post.author = author

        try:
            post._id = Post.create_post_id(author_id)
            post.author = author
            post.title = body["title"]
            post.content = body["content"]
            post.description = body["description"]
            post.source = post._id # use the local server as the source and origin, since this is a BRAND NEW post
            post.origin = settings.DOMAIN

            is_valid = self.valid_choice(body["contentType"], Post.CONTENT_TYPES) # we might not need this, but good to have just in case

            if not is_valid:
                return HttpResponseBadRequest()

            post.contentType = body["contentType"]

            categories = create_categories(body["categories"])

            post.published = datetime.now(timezone.utc)

            # TODO: this should be handled by some sort of enum system
            is_valid = self.valid_choice(body["visibility"], Post.VISIBILITY_CHOICES)

            if not is_valid:
                return HttpResponseBadRequest()

            post.visibility = body["visibility"]
            post.unlisted = body["unlisted"]

        except KeyError as error:
            return HttpResponseBadRequest()

        post.save()

        # need to do this here since postgres looks for the post id in the post table before it can add the relation

        for item in categories:
            post.categories.add(item)

        post_json = post.toJSON()

        return HttpResponse(json.dumps(post_json), status=201, content_type = CONTENT_TYPE_JSON)


# endpoints with post_id and author_id
@method_decorator(csrf_exempt, name='dispatch')
class PostWithId(APIView, RestService):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'put']

    def get(self, request: HttpRequest, *args, **kwargs):
        post_id = kwargs["post_id"]
        author_id = kwargs["author_id"]  # TODO: check author_id against current user

        try:
            post = Post.objects.get(_id=post_id)
        except:
            return HttpResponseNotFound()

        post_json = post.toJSON()

        return HttpResponse(json.dumps(post_json), content_type = CONTENT_TYPE_JSON)

    def post(self, request: HttpRequest, *args, **kwargs):
        if request.content_type != CONTENT_TYPE_JSON:
            return HttpResponseBadRequest()

        try:
            body = request.data
        except AttributeError:  # tests don't run without this
            body = request.body
            body = json.loads(body)

        post_id = kwargs["post_id"]
        author_id = kwargs["author_id"]

        try:
            post = Post.objects.get(_id=post_id)
        except:
            return HttpResponseNotFound()

        try:
            post.title = body["title"]
            post.content = body["content"]
            post.description = body["description"]

            is_valid = self.valid_choice(body["contentType"], Post.CONTENT_TYPES)  # we might not need this, but good to have just in case

            if not is_valid:
                return HttpResponseBadRequest()

            post.contentType = body["contentType"]

            is_valid = self.valid_choice(body["visibility"], Post.VISIBILITY_CHOICES)  # we might not need this, but good to have just in case

            if not is_valid:
                return HttpResponseBadRequest()

            post.visibility = body["visibility"]

            categories = create_categories(body["categories"])
            
            post.unlisted = bool(body["unlisted"])

        except KeyError as error:
            return HttpResponseBadRequest()  # should probably include the error

        post.save()

        for item in categories:
            post.categories.add(item)

        post_json = post.toJSON()

        return HttpResponse(json.dumps(post_json), status=201, content_type=CONTENT_TYPE_JSON)

    # DELETE
    def delete(self, request: HttpRequest, *args, **kwargs):
        post_id = kwargs["post_id"]
        author_id = kwargs["author_id"]

        try:
            post = Post.objects.get(_id=post_id)
        except:
            return HttpResponseNotFound()

        if post.author._id != author_id: # cannot delete a post for an author that didn't write it
            return HttpResponseNotFound()

        post.delete()

        return HttpResponse(status=202)

    # PUT
    def put(self, request: HttpRequest, *args, **kwargs):
        return HttpResponse(status=405) # we will do this later, not super useful as a local API without multiple hosts


def create_categories(json_categories):
    categories = []
    for item in json_categories:
        try:
            category = Category.objects.create(data=item)
        except:
            category = Category.objects.get(data=item)
        categories.append(category)
    
    return categories

def encode_list(posts):
    return {
        "type": "posts",
        "items": posts
    }
