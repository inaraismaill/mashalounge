import axios from "axios";
import {URL} from "../static/URL"

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
}

export class MessageService{
    save(value){
        return axios.post(URL+"/api/messageTemplate/save", value, config)
    }

    findAllNormalTemplate(){
        return axios.get(URL+ "/api/messageTemplate/findAllNormalTemplate", config)
    }
    findAllCostumerTemplate(){
        return axios.get(URL+ "/api/messageTemplate/findAllCostumerTemplate", config)
    }

    findAllFilteredTemplate(){
        return axios.get(URL+ "/api/messageTemplate/findAllFilteredTemplate", config)
    }

    findAllTeaMessageTemplate(){
        return axios.get(URL+ "/api/messageTemplate/findAllTeaMessageTemplate", config)
    }

    findAllFirstMessageTemplate(){
        return axios.get(URL+ "/api/messageTemplate/findAllFirstMessageTemplate", config)
    }

    sendAllMessages(id){

        return axios.get(URL + "/api/sendMessages/sendAllCandidate?messageTemplateId="+id, config)
    }

    sendAllCustomersMessages(id){

        return axios.get(URL + "/api/sendMessages/sendAllCostumers?messageTemplateId="+id, config)
    }

    updateMessage(data){
        return axios.put(URL + "/api/messageTemplate/updateMessage", data, config)
    }

    deleteById(id){
        return axios.delete(URL + "/api/messageTemplate/delete/" + id, config)
    }

    findMessageLogsByCandidateId(id, pageNumberMessage){
        return axios.get(URL + "/api/messageLogs/findByCandidateIdOrderBySentAtDesc?candidateId=" + id + "&pageNumber="+ pageNumberMessage, config)
    }

    sendMessageFilteredCandidate(data){
        return axios.post(URL + "/api/sendMessages/sendMessageFilteredCandidate", data, config)
    }
}