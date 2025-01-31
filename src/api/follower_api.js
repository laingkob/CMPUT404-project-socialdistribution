import axios from "axios";

export const get_followers_for_author = async (authorId, success) => {
  console.log("Attempting to retrieve followed list for", { authorId });
  await axios
    .get(`authors/${authorId}/followers/`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(function (response) {
      console.log("Followerlist res: ", response["data"]["items"]);
      success({ items: response["data"]["items"] });
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const get_followed_for_author = async (authorId, success) => {
  console.log("Attempting to retrieve followed list for", { authorId });

  await axios
    .get(`authors/${authorId}/followed/`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(function (response) {
      console.log("Followerlist res: ", response["data"]["items"]);
      success({ items: response["data"]["items"] });
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const get_friends_for_author = async (authorId, success) => {
  console.log("Attempting to retrieve follower list for", { authorId });
  await axios
    .get(`authors/${authorId}/friends/`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(function (response) {
      console.log("Followerlist res: ", response["data"]["items"]);
      success({ items: response["data"]["items"] });
    })
    .catch(function (error) {
      console.log(error);
    });
};


export const add_followers_for_author = async (authorId, followId, success) => {
  console.log("Adding follower", { followId });
  await axios
    .put(`authors/${authorId}/followers/${followId}`, {
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


export const delete_followers_for_author = async (authorId, followId, success) => {
  console.log("Deleting follower", { followId });
  await axios
    .delete(`authors/${authorId}/followers/${followId}`, {
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


export const get_request = async (authorId, success) => {
  console.log("Geting request", {authorId  });
  await axios
    .get(`authors/${authorId}/follow-requests/`, {
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

export const add_request = async (authorId, object, success) => {
  console.log("sending request to", authorId, "from ", object.actor.id);
  await axios
    //.post(`http://localhost:8000/authors/${authorId}/follow-request/${followId}`, { #this is our own endpoint
      .post(`authors/${authorId}/inbox/`,// this is what we need 
      object,
     {   
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


export const delete_request = async (authorId, followId, success) => {
  console.log("Deleting request", { followId });
  await axios
    .delete(`authors/${authorId}/follow-request/${followId}`, {
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