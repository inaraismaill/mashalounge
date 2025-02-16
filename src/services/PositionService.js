import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class PositionService {
    
    update(id, data) {
        return axios.put(`${URL}/api/employee-positions/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/employee-positions`, data, config);
    }
    
    getAll() {
        return axios.get(`${URL}/api/employee-positions`, config);
    }
}
