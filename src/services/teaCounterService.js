import axios from "axios";
import { URL } from "../static/URL";

export class TeaCounterService{

    findByCandidateId(id){
        return axios.get(URL + "/api/teaCounters/findByCandidateId?candidateId=" +id)
    }
}