import axios from "axios";
import { BASE_API_URL } from "../components/common/constants";

const BASE_URL = BASE_API_URL + '/api/authentication';

const loginService = (user) =>{
  return axios.post(BASE_URL + '/login', user);
};

const registerService = (user) =>{
  return axios.post(BASE_URL + '/signup', user);
};

// 아이디 중복확인
const checkUsernameService = (username) => {
  return axios.get(`${BASE_URL}/check-username`, {
    params: { username },
  });
}




export{loginService, registerService, checkUsernameService}

