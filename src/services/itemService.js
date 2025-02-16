import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class ItemService {
    findByOrderId(id, pageNumber) {
        return axios.get(URL + "/api/itemDetails/findByOrderId?id=+" + id + "&pageNumber=" + pageNumber, config)
    }

    getSumPricesByOrderId(id) {
        return axios.get(URL + "/api/itemDetails/getSumPricesByOrderId?id=" + id, config)
    }

    getAll() {
        return axios.get(URL + "/api/items/getAll", config)
    }

    updateItem(data) {
        return axios.put(URL + "/api/items/updateItem", data, config)
    }
}