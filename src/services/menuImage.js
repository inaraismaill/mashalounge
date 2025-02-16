import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    }
}

export class MenuImage {
    saveImage(id, formData) {
      return axios.post(`${URL}/api/menus/save-img/${id}`, formData, config);
    }
  }
