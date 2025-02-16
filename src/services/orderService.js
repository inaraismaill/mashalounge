import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class OrderService {

  close(orderId) {
    return axios.put(
      URL + "/api/orders/" + orderId + "/close", {},
      config
    );
  }

  getOrderById(orderId) {
    return axios.get(URL + "/api/orders/" + orderId + "/getActiveOrders", config)
  }

  save(value) {
    return axios.post(URL + "/api/orders", value, config);
  }

  findByOpenCheckAtIsNotNullOrderByOpenCheck(pageNumber, isEarly) {
    return axios.get(
      URL +
      "/api/orders/findByOpenCheckAtIsNotNullOrderByOpenCheck?pageNumber=" +
      pageNumber +
      "&isEarly=" +
      isEarly,
      config
    );
  }

  findByOpenCheckAtIsNullOrderByOpenCheck(pageNumber, isEarly) {
    return axios.get(
      URL +
      "/api/orders/findByOpenCheckAtIsNullOrderByOpenCheck?pageNumber=" +
      pageNumber +
      "&isEarly=" +
      isEarly,
      config
    );
  }
  updateOrderByCandidateId(value) {
    return axios.put(
      URL + "/api/orders/updateOrderByCandidateId",
      value,
      config
    );
  }

  getCount() {
    return axios.get(URL + "/api/orders/countNullCandidateId", config);
  }

  findByCandidateIdOrderByOpenCheckAtCandidateAsc(id, pageNumber, pageSize) {
    return axios.get(
      URL +
      "/api/orders/findByCandidateIdOrderByOpenCheckAtCandidateAsc?id=" +
      id +
      "&pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize,
      config
    );
  }

  findByCandidateIdOrderByOpenCheckAtCandidateDesc(id, pageNumber, pageSize) {
    return axios.get(
      URL +
      "/api/orders/findByCandidateIdOrderByOpenCheckAtCandidateDesc?id=" +
      id +
      "&pageNumber=" +
      pageNumber +
      "&pageSize=" +
      pageSize,
      config
    );
  }

  getSumAmountsByCandidateId(id) {
    return axios.get(
      URL + "/api/orders/getSumAmountsByCandidateId?id=" + id,
      config
    );
  }

  findOrderWithoutCandidateDtoById(id) {
    return axios.get(
      URL + "/api/orders/findOrderWithoutCandidateDtoById?id=" + id,
      config
    );
  }

  countByCandidateId(candidateId) {
    return axios.get(
      URL + "/api/orders/countByCandidateId?candidateId=" + candidateId,
      config
    );
  }
  updateIsIgnoreToTrue(value) {
    return axios.put(URL + "/api/orders/updateIsIgnoreToTrue", value, config);
  }

  findByDocNumberContains(pageNumber, docNumber) {
    return axios.get(
      URL +
      "/api/orders/findByDocNumberContains?pageNumber=" +
      pageNumber +
      "&docNumber=" +
      docNumber,
      config
    );
  }
}
