import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class GroupExpenseService {

  update(id, data) {
    return axios.put(`${URL}/api/groupExpenses/update/${id}`, data, config);
  }
  save(data) {
    return axios.post(URL + "/api/groupExpenses/save", data, config);//name
  }

  findAll(pageNumber) {
    return axios.get(`${URL}/api/groupExpenses/findAll?pageNumber=${pageNumber}`, config);
  }

  getAll() {
    return axios.get(`${URL}/api/groupExpenses/getAll`, config);
  }

}
