import "./posts.css"
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { send_api, post_api, edit_api } from "../../api/post_display_api";
import { get_followers_for_author } from "../../api/follower_api";
import { Alert, Snackbar } from "@mui/material";

export default function ImageUpload() {
    const user = useSelector((state) => state.user).id;

    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contentType, setContentType] = useState("text/plain");
    const [body, setBody] = useState("");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [unlisted, setUnlisted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [id, setId] = useState("");
    const [pending, setPending] = useState(false);
    const [timeToGo, setTimeToGo] = useState(false);
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
        await send_api(followers, posted)
    }

    const postEdit = async () => {
        console.log(user, "is attempting to edit post", id);
        await edit_api(user, id, data, setPosted);
    }

    const postNew = async () => {
        console.log(user, "is attempting to post", data);
        await post_api(user, data, setPosted);
    }

    const submit = (e) => { 
        console.log("Submitting Image...");

        setData({
            "title": title,
            "description": description,
            "contentType": contentType,
            "content": body,
            "visibility": visibility,
            "unlisted": unlisted,
            "categories": categories.split(",")
        });
        e.preventDefault();
        setPending(true);
    };

    const handleCheckbox = (e) => {
        //console.log(e.target.checked);
        let check = e.target.checked ? true : false;
        setUnlisted(check);
    }

    //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // by Melih Ekinci
    // from https://refine.dev/blog/how-to-base64-upload/
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(
                    fileReader.result.split("base64,").pop());
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        console.log(event.target.files[0]);
        setContentType(file.type);
        const base64 = await convertBase64(file);
        //data:image/jpeg;base64,
        const img = "data:"+file.type+";base64,"+base64;
        document.getElementById("avatar").src = img;
        setBody(base64);
    };

    const handleClose = () => {
        setAlert(false);
    };

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

    useEffect( () => {  //runs once
        let old_data = state;
        if (old_data) {
            old_data = old_data.postInfo;
            setEdit(true);
            setTitle(old_data.title);
            setDescription(old_data.description);
            setContentType(old_data.contentType);
            setBody(old_data.content);
            setCategories(old_data.categories);
            setVisibility(old_data.visibility);
            console.log("id:", old_data.id);
            setId(old_data.id.split("/").pop());
        }
    }, []);



    return (
        <div className="form-container">
            <form className="form" encType="multipart/form-data" method="POST">
                {edit ? <h1>Edit Image Post</h1> : <h1>New Image Post</h1>}
                
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
                {/*vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
                // Adapted from code by Melih Ekinci
                // from https://refine.dev/blog/how-to-base64-upload/ */}
                <input
                className="form-control form-control-lg"
                id="selectAvatar"
                type="file"
                onChange={uploadImage}
                accept="image/*"/>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <label>Image Preview:</label>
                            <img className="uploaded-image" id="avatar" />
                        </div>
                    </div>
                </div>
                {/**^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
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