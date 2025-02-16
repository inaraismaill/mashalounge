import axios from "axios";
import { URL } from "../static/URL";


const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class ReportService {

    findReportByDate(startDate, endDate){
        return axios.get(URL + "/api/reports/findReportByDate?startDate=" + startDate + "&endDate=" + endDate, config)
    }

    reportToPhoneNumber(data){
        return axios.post(URL + "/api/reports", data, config)
    }
}