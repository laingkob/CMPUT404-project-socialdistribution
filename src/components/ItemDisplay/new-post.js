import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { send_api, post_api, edit_api } from "../../api/post_display_api";
import { get_followers_for_author } from "../../api/follower_api";
import "./form.css";
import { useLocation } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

export default function NewPost() {
    //Get user info
    const user = useSelector((state) => state.user).id;

    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contentType, setContentType] = useState("");
    const [body, setBody] = useState("");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [unlisted, setUnlisted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState("");
    const [pending, setPending] = useState(false);
    const [data, setData] = useState({});
    const [alert, setAlert] = useState(false);

    const [followers, setFollowers] = useState([]);
    const [posted, setPosted] = useState(null);

    const {state} = useLocation();
    const navigate = useNavigate();

    const populateFollowers = async () => {
        await get_followers_for_author(user, setFollowers);
    }

    const sendPost = async () => {
        await send_api(followers, posted);
    }

    const postEdit = async () => {
        console.log(user, "is attempting to edit post", id);
        await edit_api(user, id, data, setPosted);
    }

    const postNew = async () => {
        console.log(user, "is attempting to post", data);
        await post_api(user, data, setPosted);
    }

    const submit = async (e) => {
        console.log("Submitting ...");

        setData({"title": title,
        "description": description,
        "contentType": contentType,
        "content": body,
        "visibility": visibility,
        "unlisted": unlisted,
        "categories": categories.split(",")});

        e.preventDefault();
        setPending(true);
    };

    const handleCheckbox = (e) => {
        //console.log(e.target.checked);
        let check = e.target.checked ? true : false;
        setUnlisted(check);
    }

    const handleClose = () => {
        setAlert(false);
    };

    useEffect( () => {
        let data = state;
        if (data) {
            data = data.postInfo;
            setEdit(true);
            setTitle(data.title);
            setDescription(data.description);
            setContentType(data.contentType);
            setBody(data.content);
            setCategories(data.categories);
            setVisibility(data.visibility);
            console.log("id:", data.id);
            setId(data.id.split("/").pop());
        }
    }, []);


    useEffect(() => {
        //only runs once
        populateFollowers();
      }, []);

    //Adapted from code by Theviyanthan Krishnamohan https://thivi.medium.com/
    // at https://medium.com/swlh/prevent-useeffects-callback-firing-during-initial-render-the-armchair-critic-f71bc0e03536#:~:text=Well%2C%20useEffect's%20callback%20function%20gets,false%20after%20the%20initial%20render.
    const init1 = useRef(true);
    useEffect(() => {    //prevent on intial render
            if (init1.current) {
                init1.current = false;
            } else {
                //runs when object posted
                setAlert(true);
                sendPost();
                navigate("/");
            }
    }, [posted]);

    const init2 = useRef(true);
    useEffect( () => {
        if (init2.current) {
            init2.current = false;
        } else {
            if (edit) {
                postEdit();
            } else {
                postNew();
            }
        }
    }, [pending]);
    //endcite
    
    return (
        <div className="form-container">
            <form className="form" encType="multipart/form-data" method="POST">
                {edit ? <h1>Edit Text Post</h1> : <h1>New Text Post</h1>}
                <div className="form-group">
                    <label for="contentType">Content Type: </label>
                    <select value={contentType} 
                            name="contentType" 
                            className="dropdown"
                            onChange={(e) => setContentType(e.target.value)}>
                        <option
                            value="text/plain">
                        Plain Text
                        </option>
                        <option
                            value="text/markdown">
                        Markdown
                        </option>
                     </select>
                </div>
                <label>Visibility: </label>
                <select value={visibility} 
                        name="visibility" 
                        className="dropdown"
                        onChange={(e) => setVisibility(e.target.value)}
                >
                    <option
                        value="PUBLIC"
                    >
                    Public
                    </option>
                    <option
                        value="FRIENDS"
                        >
                    Friends Only
                    </option>
                </select>
                {!edit && <><label>  Unlisted</label>
                <input
                    name="unlisted"
                    type="checkbox"
                    defaultChecked={false}
                    onChange={handleCheckbox}
                /></>}
                <br/>
                <div className="form-group">
                    <input
                        className="form-control"
                        placeholder="Title.."
                        name="title"
                        type="text"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <textarea 
                    className="form-control ta"
                    placeholder="Content.."
                    type="text"
                    rows="4"
                    value={body}
                    required
                    onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <div className="form-group">
                <textarea
                    className="form-control ta"
                    placeholder="Description.."
                    name="description"
                    type="text"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                />
                </div>
                <textarea
                    placeholder="Categories.."
                    className="form-control ta"
                    name="categories"
                    type="text"
                    value={categories}
                    required
                    onChange={(e) => setCategories(e.target.value)}
                /><br/>
                <button type="submit" className="btn" onClick={submit}>Submit</button>
            </form>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={alert}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                "Posted"
                </Alert>
            </Snackbar>
        </div>

    );
}
