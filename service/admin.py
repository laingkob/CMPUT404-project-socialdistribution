from django.contrib import admin
from service.models import author, post, comment, like, inbox, follow

# Register your models here.

admin.site.register(author.Author)
#admin.site.register(follow.Followers)
admin.site.register(post.Post) #we don't need this here, but leaving as comment just in case
#admin.site.register(post.Category)
admin.site.register(like.Like)
admin.site.register(comment.Comment)
# admin.site.register(follow.Followers)
#admin.site.register(inbox.Inbox)