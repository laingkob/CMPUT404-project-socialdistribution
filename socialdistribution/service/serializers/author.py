from rest_framework import serializers
from service.models.author import Author

class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField("set_id")
    type = serializers.SerializerMethodField("set_type")
    url = serializers.SerializerMethodField("set_url")

    def set_id(self, author):
        return str(author._id)
    
    def set_type(self, author):
        return "author"
    
    def set_url(self, author):
        return str(author.host)

    class Meta:
        model = Author
        fields = ["type", "id", "url", "host", "displayName", "github", "profileImage"]


class MultipleAuthorSerializer(serializers.Serializer):
    type = serializers.SerializerMethodField("set_type")
    items = serializers.ListField(
        child=AuthorSerializer()
    )

    def set_type(self, author):
        return "authors"
    
    class Meta:
        model = Author
        fields = ["type", "items"]
