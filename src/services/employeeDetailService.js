import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export class EmployeeDetailService {
    updateEmployee(data) {
        return axios.put(URL + "/api/employeeDetails", data, config)
    }

    saveEmployee(data) {
        return axios.post(URL + "/api/employeeDetails/save", data, config)
    }

    getEmployeeDetailById(id) {
        return axios.get(URL + "/api/employeeDetails/" + id, config)
    }

    deleteById(id) {
        return axios.delete(URL + "/api/employeeDetails/" + id, config)
    }

    getAll(pageNumber) {
        return axios.get(URL + "/api/employeeDetails/getAll?pageNumber=" + pageNumber, config)
    }

    getByDetail(data) {
        return axios.get(URL + " /api/employeeDetails/findEmployeeDetailByFullNameAndPosition", data, config)
    }

}