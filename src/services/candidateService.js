import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class CandidateService {
  save(value) {
    return axios.post(`${URL}/api/candidates/save`, value, config);
  }

  getAll(
    pageNumber,
    firstNameOrPhoneNumber,
    rowsPerPage,
    sortProperty,
    sortDirection
  ) {
    const encodedFirstNameOrPhoneNumber = encodeURIComponent(firstNameOrPhoneNumber);
  //  console.log(pageNumber,firstNameOrPhoneNumber,rowsPerPage,sortProperty,sortDirection);
    
    return axios.get(
      `${URL}/api/candidates/getAll?pageNumber=${pageNumber}&firstNameOrPhoneNumber=${encodedFirstNameOrPhoneNumber}&rowsPerPage=${rowsPerPage}&sortDirection=${sortDirection}&sortProperty=${sortProperty}`,
      config
    );
  }

  getCount() {
    return axios.get(`${URL}/api/candidates/getCount`, config);
  }

  findByFirstNameContainsIgnoreCase(firstName) {
    const encodedFirstName = encodeURIComponent(firstName);
    return axios.get(
      `${URL}/api/candidates/findByFirstNameContainsIgnoreCase?firstName=${encodedFirstName}`,
      config
    );
  }

  findByCandidateId(candidateId) {
    return axios.get(
      `${URL}/api/candidates/findByCandidateId?candidateId=${candidateId}`,
      config
    );
  }

  updateCashback(value) {
    return axios.put(`${URL}/api/candidates/updateCashback`, value, config);
  }

  findById(id) {
    return axios.get(`${URL}/api/candidates/findById?id=${id}`, config);
  }

  update(data) {
    return axios.put(`${URL}/api/candidates/update`, data, config);
  }

  findByOrderIsNullAndFullNameContainsIgnoreCase(
    firstName,
    pageNumber,
    rowsPerPage,
    sortProperty,
    sortDirection
  ) {
    const encodedFirstName = encodeURIComponent(firstName);
    return axios.get(
      `${URL}/api/candidates/getAll?pageNumber=${pageNumber}&firstNameOrPhoneNumber=${encodedFirstNameOrPhoneNumber}&rowsPerPage=${rowsPerPage}&sortDirection=${sortDirection}&sortProperty=${sortProperty}`,
      config
    );
  }

  findByOrderIsNotNullAndFullNameContainsIgnoreCase(
    firstName,
    pageNumber,
    rowsPerPage,
    sortProperty,
    sortDirection
  ) {
    const encodedFirstName = encodeURIComponent(firstName);
    return axios.get(
      `${URL}/api/candidates/getAll?pageNumber=${pageNumber}&firstNameOrPhoneNumber=${encodedFirstNameOrPhoneNumber}&rowsPerPage=${rowsPerPage}&sortDirection=${sortDirection}&sortProperty=${sortProperty}`,
      config
    );
  }

  countCandidatesByOrderIsNotNull() {
    return axios.get(
      `${URL}/api/candidates/countCandidatesByOrderIsNotNull`,
      config
    );
  }

  countCandidatesByOrderIsNull() {
    return axios.get(
      `${URL}/api/candidates/countCandidatesByOrderIsNull`,
      config
    );
  }

  countAllCandidate() {
    return axios.get(`${URL}/api/candidates/countAllCandidates`, config);
  }

  filterByFoodDepartment(data) {
    return axios.post(
      `${URL}/api/candidates/filterByFoodDepartment`,
      data,
      config
    );
  }
}
