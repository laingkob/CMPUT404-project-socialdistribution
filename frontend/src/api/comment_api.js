import axios from "axios";

import { post_inbox } from "../api/inbox_api";

export const post_comment = async (authorId, postId, comment, success) => {
  console.log("Attempting to post comment for", { postId });
  const data = { comment: comment, contentType: "text/markdown" };

  /*Temporary Data*/
  authorId = "http://localhost/authors/2c2600e9-f81d-491b-b3fe-f8dd7f984f01";
  postId =
    "http://localhost/authors/2c2600e9-f81d-491b-b3fe-f8dd7f984f01/posts/bcff78e5-3686-4103-b88e-8e4e297825b0";

  const res = await axios.post(
    `http://localhost:8000/authors/${authorId}/posts/${postId}/comments/`,
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  console.log(res);
  if (res.status == 201) {
    post_inbox(authorId, res.data);
    console.log("Success!");
  } else {
    console.log("Error Occured");
  }
};
