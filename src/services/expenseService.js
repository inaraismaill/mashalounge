import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class ExpenseService {
    update(id, data) {
        return axios.put(`${URL}/api/expenses/update/${id}`, data, config);
    }

    save(data) {
        return axios.post(`${URL}/api/expenses/save`, data, config);
    }

    findAllPaginate(pageNumber) {
        return axios.get(`${URL}/api/expenses/findAllPaginate?pageNumber=${pageNumber}`, config);
    }

    findById(id) {
        return axios.get(`${URL}/api/expenses/find/${id}`, config);
    }

    delete(id) {
        return axios.delete(`${URL}/api/expenses/${id}`, config);
    }
}
