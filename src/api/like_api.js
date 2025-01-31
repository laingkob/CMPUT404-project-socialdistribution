import axios from "axios";

export const get_post_like = async (authorId, postId, success) => {
  console.log("Attempting to get likes for post", { postId });

  const res = await axios.get(`authors/${authorId}/posts/${postId}/likes/`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) {
    console.log("Success!");
    success(res.data);
  } else {
    console.log("Error Occured");
  }
};

export const get_comment_like = async (
  authorId,
  postId,
  commentId,
  success
) => {
  console.log("Attempting to get likes for comment", { commentId });

  const res = await axios.get(
    `authors/${authorId}/posts/${postId}/comments/${commentId}/likes/`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status === 200) {
    console.log("Success!");
    success(res.data);
  } else {
    console.log("Error Occured");
  }
};

export const post_like = async (
  likedAuthorId,
  likeAuthor,
  postId,
  context,
  success
) => {
  console.log("Attempting to POST like for post", { postId });
  const data = {
    type: "Like",
    context: context,
    author: likeAuthor,
    object: `https://social-distribution-w23-t17.herokuapp.com/authors/${likedAuthorId /* URL Needs to be updated once hosted on heroku */
      .split("/")
      .pop()}/posts/${postId.split("/").pop()}`,
  };
  const res = await axios.post(`authors/${likedAuthorId}/inbox/`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status === 202) {
    console.log("Success!");
    success(true);
  } else {
    console.log("Error Occured");
  }
};

export const comment_like = async (
  objectAuthorId,
  likedAuthorId,
  likeAuthor,
  postId,
  commentId,
  context,
  success
) => {
  const data = {
    type: "Like",
    context: context,
    author: likeAuthor,
    object: `https://social-distribution-w23-t17.herokuapp.com/authors/${objectAuthorId
      .split("/")
      .pop()}/posts/${postId.split("/").pop()}/comments/${commentId
      .split("/")
      .pop()}`,
  };

  const res = await axios.post(`authors/${likedAuthorId}/inbox/`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status === 202) {
    console.log("Success!");
    success(true);
  } else {
    console.log("Error Occured");
  }
};

export const get_liked = async (authorId, success) => {
  console.log("Attempting to get liked objects for", { authorId });
  const res = await axios.get(`authors/${authorId}/liked/`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) {
    console.log("Success! Liked received");
    success(res.data.items);
  } else {
    console.log("Error Occured");
  }
};
