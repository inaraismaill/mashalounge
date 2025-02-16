import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class PresentServie {
    findByIdAndStatusIsTrue(id){
        return axios.get(URL + "/api/presents/findByIdAndStatusIsTrue?id=" +id, config)
    }

    update(data){
        return axios.put(URL+"/api/presents/update",data, config)
    }

    findByCandidateIdAndStatusIsTrue(candidateId){
      return axios.get(URL + "/api/presents/findByCandidateIdAndStatusIsTrue?candidateId="+ candidateId)
    }
}