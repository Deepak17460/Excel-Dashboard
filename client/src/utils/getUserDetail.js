import axios from "axios";

const URL = "http://localhost:8081/api/users";

async function getUser(id) {
  try {
    const res = await axios.get(URL + "/" + id);
    console.log(res.data);
    //TODO: store in gloabl store
    return res.data.name;
  } catch (error) {
    console.log(error.response.data.message);
  } finally {
    return null;
  }
}

export default getUser;
