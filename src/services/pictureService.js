import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class PictureService {

    save(form){
        return axios.post(URL + "/api/picture/save", form, config)
    }
}