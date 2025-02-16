import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class PaymentService{
    
    findByOrderId(id){
        return axios.get(URL+ "/api/payments/findByOrderId?id=" + id, config)
    }
}