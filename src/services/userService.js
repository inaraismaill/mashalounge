import axios from "axios";
import { URL } from "../static/URL";

export class UserService{
    
    login(value){
        return axios.post(URL+"/api/auth/login", value);
    }
}