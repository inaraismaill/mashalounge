import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class UnitService {

    update(id, data) {
        return axios.put(`${URL}/api/units/update/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/units/save`, data, config);
    }

    getAll() {
        return axios.get(`${URL}/api/units`, config);
    }


    delete(id) {
        return axios.delete(`${URL}/api/units/${id}`, config);
    }
}