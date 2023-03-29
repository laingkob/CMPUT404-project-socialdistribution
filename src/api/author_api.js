import axios from "axios";

export const get_author = async (authorId, success) => {
  console.log("Attempting to retrieve author info for", { authorId });
  await axios
    .get(`authors/${authorId}`, {
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

export const get_all_authors = async (page, success) => {
  console.log("Attempting to retrieve all authors");
  await axios
    .get(`authors/?page=${page}`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then(function (response) {
      console.log("Multi Author_api res: ", response);
      success(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const update_author = async (
  authorId,
  displayName,
  github,
  profileImage,
  success
) => {
  console.log("Attempting to retrieve author info for", { authorId });
  const data = {
    displayName: displayName,
    github: github,
    profileImage: profileImage,
  };
  await axios
    .post(`authors/${authorId}/`, data, {
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
