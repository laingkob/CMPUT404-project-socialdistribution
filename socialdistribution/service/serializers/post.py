from rest_framework import serializers
from service.models.post import Post

class PostSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField("set_id")
    type = serializers.SerializerMethodField("set_type")
    url = serializers.SerializerMethodField("set_url")

    def set_id(self, author):
        return str(author._id)
    
    def set_type(self, author):
        return "post"
    
    def set_url(self, author):
        return str(author.host)

    class Meta:
        model = Post
        fields = []


class MultiplePostSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField("set_type")
    items = serializers.ListField(
        child=PostSerializer()
    )

    def set_type(self, author):
        return "posts"
    
    class Meta:
        model = Post
        fields = ["type", "items"]
