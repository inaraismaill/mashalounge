import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class MenuService {

    // increasingCount(id) {
    //     return axios.put(`${URL}/api/menus/${id}/increment-sold-count`, config);
    // }
    increasingCount(id) {
        return axios.put(`${URL}/api/menus/${id}/increment-sold-count`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
    }

    update(id, data) {
        return axios.put(`${URL}/api/menus/update/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/menus/save`, data, config);
    }

    getByGroup() {
        return axios.get(`${URL}/api/menus/getByGroup`, config);
    }

    getAll() {
        return axios.get(`${URL}/api/menus/getAll`, config);
    }

    findAll(pageNumber) {
        return axios.get(`${URL}/api/menus/findAll?pageNumber=${pageNumber}`, config);
    }

    delete(id) {
        return axios.delete(`${URL}/api/menus/${id}`, config);
    }
}
