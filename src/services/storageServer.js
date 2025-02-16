import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class StorageService {

    update(id, data) {
        return axios.put(URL + `/api/storage/${id}`, data, config);
    }
    delete(id) {
        return axios.delete(URL + `/api/storage/${id}`, config);
    }

    save(data) {
        return axios.post(URL + "/api/storage", data, config);
    }

    getAll() {
        return axios.get(URL + "/api/storage/getAll", config);
    }

    getAllPaginate(pageNumber) {
        return axios.get(`${URL}/api/storage/getAllPaginate?pageNumber=${pageNumber}`, config);
    }
}