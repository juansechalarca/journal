import axios from "axios";

const journalApi = axios.create({
  baseURL: "https://vue-demo-7948d-default-rtdb.firebaseio.com",
});

export default journalApi;
