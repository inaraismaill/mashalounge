import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class ItemExpenseService {

  update(id, data) {
    return axios.put(`${URL}/api/itemExpenses/update/${id}`, data, config);
  }

  save(data) {
    return axios.post(URL + "/api/itemExpenses", data, config);
  }

  getAll() {
    return axios.get(URL + "/api/itemExpenses/getAll", config);
  }
  
  findById(groupId) {
    return axios.get(`${URL}/api/itemExpenses/findById/${groupId}`, config);
  }

  findAllPaginate(pageNumber) {
    return axios.get(`${URL}/api/itemExpenses/findAllPaginate?pageNumber=${pageNumber}`, config);
  }
}
