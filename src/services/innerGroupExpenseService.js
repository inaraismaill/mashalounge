import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class InnerGroupExpenseService {

  update(id, data) {
    return axios.put(URL + "/api/innerGroupExpenses/update/" + id, data, config);
  }
  save(data) {
    return axios.post(URL + "/api/innerGroupExpenses/save", data, config)
  }

  findAll(pageNumber) {
    return axios.get(
      URL + "/api/innerGroupExpenses/findAllPagination?pageNumber=" + pageNumber,
      config
    );
  }

  findAllByGroupId(groupId) {
    return axios.get(
      `${URL}/api/innerGroupExpenses/findAllByGroupId/${groupId}`, config
    );
  }

  findById(id) {
    return axios.get(
      URL + "/api/innerGroupExpenses/find?id=" + id,
      config
    );
  }
}
