import axios from "axios";
import { get_followers_for_author } from "./follower_api";

let head = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const post_api = async (authorId, post, successPost) => {
  await axios
    .post(`authors/${authorId}/posts/`, post, head)
    .then(function (response) {
      console.log("Post res: ", response["data"]);
      successPost(response["data"]);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const send_api = async (followers, data) => {
  console.log("Sending to api . . .", followers);
  for (var user in followers.items) {
    console.log("sending ", data, " to ", followers.items[user]["id"]);
    await axios
      .post(`authors/${followers.items[user]["id"]}/inbox/`, data, head)
      .catch(function (error) {
        console.log(error, "occured while sending a post");
      });
  }
};

export const get_author_posts = async (authorId, page, success) => {
  console.log("Attempting to retrieve author info for", { authorId });
  await axios
    .get(`authors/${authorId}/posts/?page=${page}`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(function (response) {
      console.log("Author_api res: ", response);
      success(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const get_inbox_posts = async (authorInbox, page, success) => {
  console.log("Attempting to retrieve inbox info for", { authorInbox });
  await axios
    .get(`authors/${authorInbox}/?page=${page}`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(function (response) {
      console.log("get_inbox_posts res: ", response.data);
      success(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const get_post = async (authorId, postId, success) => {
  console.log("Attempting to get post", { postId });
  try {
    const res = await axios.get(`authors/${authorId}/posts/${postId}/`, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("Success");
    success(res.data);
  } catch (error) {
    console.log(error);
    success(error.response.status);
  }
};

export const edit_api = async (authorId, postId, post, onSuccess) => {
  await axios
  .post(`authors/${authorId}/posts/${postId}/`, post, head)
  .then(function (response) {
    console.log("Edit res: ", response["data"]);
    onSuccess(response["data"]);
  })
  .catch(function (error) {
    console.log(error);
  });
}
