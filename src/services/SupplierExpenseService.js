import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class SupplierService {
  update(id, data) {
    return axios.put(`${URL}/api/suppliers/update/${id}`, data, config);
  }

  getAll() {
    return axios.get(`${URL}/api/suppliers/getAll`,config,
    );
  }

  createSupplier(supplierData) {
    return axios.post(`${URL}/api/suppliers`, supplierData, config);
  }

  getAllPaginate(pageNumber) {
    return axios.get(`${URL}/api/suppliers/getAllPaginate?pageNumber=${pageNumber}`, config);
  }
}
