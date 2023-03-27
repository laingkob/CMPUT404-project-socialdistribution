from django.core.exceptions import ObjectDoesNotExist

from service.models import Author
from django.conf import settings

import requests

from service.models.post import Post


# AUTHOR HELPERS

def get_or_create_author(author_json, hostname):
    host_url = hostname + str(author_json["id"]) #this is an int

    try:
        # update old -> don't change host_url or id
        old_author = Author.objects.get(url=host_url)

        old_author.github = author_json["github"]
        old_author.profileImage = author_json["profileImage"]
        old_author.displayName = author_json["displayName"]
        old_author.save()

        return old_author

    except ObjectDoesNotExist:
        # create new
        new_author = Author()
        new_author.github = author_json["github"]
        new_author.profileImage = author_json["profileImage"]
        new_author.displayName = author_json["displayName"]
        new_author.url = host_url
        new_author.host = hostname
        new_author.save()

        return new_author

def get_single_author(author):
    try:
        response = requests.get(settings.REMOTE_USERS[0][1] + "service/authors/" + author.url.rsplit('/', 1)[-1],
                                auth=settings.REMOTE_USERS[0][2])
        response.close()
    except Exception as e:
        print(e)
        return None

    # not updating for now...
    if response.status_code < 200 or response.status_code > 299:
        author = None
        return author

    return get_or_create_author(response.json(), author.host)

def get_multiple_authors():
    try:
        response = requests.get(settings.REMOTE_USERS[0][1] + "service/authors/", auth=settings.REMOTE_USERS[0][2])
        response.close()
    except:
        return

    if response.status_code < 200 or response.status_code > 299:  # unsuccessful
        return

    response_json = response.json()

    for author in response_json["items"]:
        get_or_create_author(author, settings.REMOTE_USERS[0][1])

# POST HELPERS

def get_multiple_posts(author):
    url = settings.REMOTE_USERS[0][1] + "service/authors/" + author.url.rsplit('/', 1)[-1] + "/posts/"

    try:
        response = requests.get(url, auth=settings.REMOTE_USERS[0][2])
        response.close()
    except:
        return

    if response.status_code < 200 or response.status_code > 299:  # unsuccessful
        return

    items = list()

    for item in response.json()["items"]:
        post = get_or_create_post(item, author, author.host)
        items.append(post.toJSON())

    return items

def get_or_create_post(post_json, author, hostname):
    # use source as the id for the remote
    # use origin as the host name
    remote_source = hostname + str(post_json["id"])  # this is an int

    try:
        # update old -> don't change host_url or id
        old_post = Post.objects.get(source=remote_source)
        return old_post

    except ObjectDoesNotExist:
        # create new
        new_post = Post().toObject(post_json)
        new_post._id = Post.create_post_id(author._id)
        new_post.categories.set(post_json["categories"])
        new_post.source = remote_source
        new_post.author = author
        new_post.save()

        return new_post

# FOLLOWER HELPERS

def get_all_followers(author):
    pass