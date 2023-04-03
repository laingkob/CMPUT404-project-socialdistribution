import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { send_api, post_api } from "../../api/post_display_api";
import { get_followers_for_author } from "../../api/follower_api";

export default function NewPost() {
    //Get user info
    const user = useSelector((state) => state.user).id;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contentType, setContentType] = useState("text/plain");
    const [body, setBody] = useState("");
    const [visibility, setVisibility] = useState("");
    const [unlisted, setUnlisted] = useState(false);
    const [categories, setCategories] = useState([]);

    const [followers, setFollowers] = useState([]);
    const [posted, setPosted] = useState(null);

    const populateFollowers = async () => {
        await get_followers_for_author(user, setFollowers);
    }

    const sendPost = async () => {
        await send_api(followers, posted);
    }

    const submit = async (e) => {
        console.log("Submitting ...");
        let data = {"title": title,
        "description": description,
        "contentType": contentType,
        "content": body,
        "visibility": visibility,
        "unlisted": unlisted,
        "categories": categories.split(",")};

        e.preventDefault();
        console.log(user, "is attempting to post", data);
        await post_api(user, data, setPosted);
        
        //let followers = get_followers_for_author(user, setSucess);
        // console.log("Starting to send ...");
        // send_api(followers, sendLink);
    };

    const handleCheckbox = (e) => {
        //console.log(e.target.checked);
        let check = e.target.checked ? true : false;
        setUnlisted(check);
    }

    useEffect(() => {
        //only runs once
        populateFollowers();
      }, []);

    useEffect(() => {
        //runs when object posted
        sendPost();
      }, [posted]);

    return (
        <div>
            <form encType="multipart/form-data" method="POST">
            <label>Content Type: </label>
                    <br/>
                    <input
                        name="type"
                        type="radio"
                        value="text/plain"
                        required
                        onChange={(e) => setContentType(e.target.value)}/>
                     Plain Text
                     <br/>
                    <input
                        name="type"
                        type="radio"
                        value="text/markdown"
                        required
                        onChange={(e) => setContentType(e.target.value)}/>
                     Markdown
                     <br/>
                <label>Title</label><br/>
                <input
                    placeholder="Title.."
                    name="title"
                    type="text"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                /><br/>
                <label>Description</label><br/>
                <textarea
                    placeholder="Description.."
                    name="description"
                    type="text"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                /><br/>
                <label>Body</label><br/>
                    <textarea
                    placeholder="Content.."
                    name="content"
                    type="text"
                    value={body}
                    required
                    onChange={(e) => setBody(e.target.value)}
                /><br/>
                
                <label>Visibility</label><br/>
                Public
                    <input
                        name="visibility"
                        type="radio"
                        value="PUBLIC"
                        required
                        onChange={(e) => setVisibility(e.target.value)}
                    /><br/>
                Friends Only
                    <input
                            name="visibility"
                            type="radio"
                            value="FRIENDS"
                            required
                            onChange={(e) => setVisibility(e.target.value)}
                        /><br/>
                
                <label>Unlisted</label>
                <input
                    name="unlisted"
                    type="checkbox"
                    defaultChecked={false}
                    onChange={handleCheckbox}
                /><br/>
                <label>Categories</label><br/>
                <textarea
                    placeholder="Categories.."
                    name="categories"
                    type="text"
                    value={categories}
                    required
                    onChange={(e) => setCategories(e.target.value)}
                /><br/>
                <button type="submit" onClick={submit}>Submit</button>
            </form>
        </div>

    );
}
