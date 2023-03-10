from rest_framework import serializers
from service.models.comment import Comment
from service.serializers.author import AuthorSerializer

class CommentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField("set_type")
    id = serializers.SerializerMethodField("set_id")
    author = AuthorSerializer()
    
    def set_type(self, comment):
        return "comment"
    
    def set_id(self, comment):
        return str(comment._id)

    class Meta:
        model = Comment
        fields = ["type", "author", "comment", "contentType", "published", "id"]

class PagedCommentSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField("set_type")
    page = serializers.IntegerField()
    size = serializers.IntegerField()
    post = serializers.URLField()
    id = serializers.URLField()
    items = serializers.ListField(
        child=CommentSerializer()
    )

    def set_type(self, author):
        return "comments"
    
    class Meta:
        model = Comment
        fields = ["type", "page", "size", "post", "id", "items"]
