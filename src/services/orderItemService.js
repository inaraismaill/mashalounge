import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class OrderItemService {

    update(itemId, data) {
        return axios.put(`${URL}/api/orders/items/${itemId}/status`, data, config);
    }
    updateWaiter(itemId, data) {
        return axios.put(`${URL}/api/orders/items/${itemId}/status-waiter`, data, config);
    }

    getAll(params) {
        return axios
            .get(`${URL}/api/orders/items`, { params, ...config })
            .then((res) => res.data);
    }

    getAllWaiter(id) {
        return axios.get(`${URL}/api/orders/items/waiter?waiterId=${id}`, config);
    }

    delete(itemId) {
        return axios.delete(`${URL}/api/orders/items/${itemId}`, config);
    }
}