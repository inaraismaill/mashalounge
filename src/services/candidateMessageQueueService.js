import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
}

export class CandidateMessageQueueService {
    getAllCandidateMessageQueuesByMessageContentId(id, pageNumber){
        return axios.get(URL + "/api/candidateMessageQueues/getAllCandidateMessageQueuesByMessageTemplateId?messageTemplateId=" + id + "&pageNumber=" + pageNumber, config)
    }

    getCandidateCountByMessageTemplateId(id){
        return axios.get(URL + "/api/candidateMessageQueues/getCandidateCountByMessageTemplateId?messageTemplateId="+id, config)
    }
}