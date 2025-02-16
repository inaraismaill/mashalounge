import axios from "axios";
import { URL } from "../static/URL";

// const URL = "https://test.mashalounge.com";
const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class RoomsService {
    update(id, data) {
        return axios.put(`${URL}/api/rooms/update/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/rooms/save`, data, config);
    }
    
    getAll() {
        return axios.get(`${URL}/api/rooms/getAll`, config);
    }

    findAll(pageNumber) {
        return axios.get(`${URL}/api/rooms/findAll?pageNumber=${pageNumber}`, config);
    }

    delete(id) {
        return axios.delete(`${URL}/api/rooms/${id}`, config);
    }
}
