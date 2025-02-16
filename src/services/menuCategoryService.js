import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class MenuCategoryService {

    update(id, data) {
        return axios.put(`${URL}/api/menuGroups/update/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/menuGroups/save`, data, config);
    }
    
    getAll() {
        return axios.get(`${URL}/api/menuGroups/getAll`, config);
    }

    findAll(pageNumber) {
        return axios.get(`${URL}/api/menuGroups/findAll?pageNumber=${pageNumber}`, config);
    }

    delete(id) {
        return axios.delete(`${URL}/api/menuGroups/${id}`, config);
    }
}
