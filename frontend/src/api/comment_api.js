import axios from "axios";

export const post_comment = async (authorId, postId, comment, success) => {
  console.log("Attempting to post comment for", { postId });
  const data = { comment: comment };

  const res = await axios.post(
    `http://localhost:8000/authors/${authorId}/posts/${postId}`,
    data,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  console.log(res);
};
