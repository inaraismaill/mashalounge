import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class PincodeService {   

    verify(data) {
        return axios.post(`${URL}/api/pin/verify`, data, config);
    } 

    save(data) {
        return axios.post(`${URL}/api/pin/save`, data, config);
    }

}
