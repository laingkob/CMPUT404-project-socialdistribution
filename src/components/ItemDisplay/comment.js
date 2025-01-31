import "./posts.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Markdown from "react-markdown-it";
import { comment_like } from "../../api/like_api";
import { get_liked } from "../../api/like_api";
import LikeHeart from "../Buttons/like_button";
import profile from "../../images/profile.png"
import { Link } from "react-router-dom";

export default function Comment(data) {
  let id = useSelector((state) => state.user).id;
  const user = useSelector((state) => state.user);
  const [liked, setLiked] = useState(data.liked);

  //Check if markdown
  let markdown = data["data"]["contentType"] === "text/markdown" ? true : false;

  const port = window.location.port ? `:${window.location.port}` : "";
  const commentUrl = `${data.data.id}`;
  const authorUrl = `//${window.location.hostname}${port}/user/${(
    data.data.author.id ?? ""
  )
    .split("/")
    .pop()}`; // allows linking to the author who wrote the comment
  const postUrl =
    `//${window.location.hostname}${port}/user/${commentUrl.split("/")[4]}` +
    "/post/" +
    commentUrl.split("/")[6];

  const like_success = (bool) => {
    /* Show Success Snackbar? */
    setLiked(bool);
    get_liked(id, data.updateList);
  };

  const handleLike = () => {
    console.log(postUrl)
    if (!liked) {
      comment_like(
        data.data.id.split("/")[4],
        data.data.author.id,
        user,
        postUrl,
        data.data.id,
        "context",
        like_success
      );
    } else {
      //TODO delete like object
      console.log("Liked already");
    }
  };

  return (
    <div className="vflex">
      <h6>
        <Link to={authorUrl}>{data.data.author.displayName}</Link> commented on
        your <Link to={postUrl}>post</Link>
      </h6>

      <div className="list-item">
        {/* Profile image w/link to post author's profile */}
        <div className="profile from">
          <Link to={authorUrl}>
            {<img alt="author" src={data.data.author.profileImage === "" ? profile : data.data.author.profileImage}></img>}
          </Link>
        </div>

        {/* Title, message */}
        <div className="comment">
          {markdown && (
            <Markdown
              className="content"
            >
            {data["data"]["comment"]}
            </Markdown>
          )}
          {!markdown && (
            <div className="content">{data["data"]["comment"]}</div>
          )}
        </div>
        {/* Interaction Options (like, share) */}
        <div>
          <LikeHeart handleLike={handleLike} liked={liked} />
        </div>
      </div>
      <div className="timestamp">{data["data"]["published"]}</div>
    </div>
  );
}
