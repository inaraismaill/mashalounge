import axios from "axios";
import { URL } from "../static/URL";
const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class  TablesService {
    update(id, data) {
        return axios.put(`${URL}/api/tables/update/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/tables/save`, data, config);
    }
    
    getAll() {
        return axios.get(`${URL}/api/tables/getAll`, config);
    }

    findAll(pageNumber) {
        return axios.get(`${URL}/api/tables/findAll?pageNumber=${pageNumber}`, config);
    }

    delete(id) {
        return axios.delete(`${URL}/api/tables/${id}`, config);
    }
}
