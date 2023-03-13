from rest_framework.views import APIView
from rest_framework.response import Response
from service.models.author import Author
from service.models.like import Like
from service.models.post import Post
from service.service_constants import *
import json


class LikedView(APIView):

    def get(self, request, author_id):
        try:
            author_query = Author.objects.get(_id = author_id)
            liked = Like.objects.filter(author=author_query) # would be better to add author_id field into Liked model, so it takes less resources to querying
        except:
            return Response(status=404)
        
        likes = list()

        for item in liked:
            likes.append(item.toJSON())

        return Response(encode_list(likes))

class LikesView(APIView):

    def get(self, request, author_id, post_id):
        if not Author.objects.filter(_id=author_id).exists():
            return Response({"error": "No author exists!"}, status=404)
        if not Post.objects.filter(_id=post_id).exists(): 
            return Response({"error": "No post exists!"}, status=404)        

        post_likes = list(Like.objects.filter(object=post_id).all())

        json_likes = list()
        for like in post_likes:
            json_likes.append(like.toJSON())

        return Response(encode_list(json_likes), status=200)

def encode_list(likes):
    return {
        "type": "liked",
        "items": likes
    }