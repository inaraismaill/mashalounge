import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class MessageService {
  getMessagesByPhoneNumber(
    phoneNumber = "",
    pageNumber = 0,
    pageSize = 100,
    sortDirection = "",
    sortProperty = "",
    startDateStr = "",
    endDateStr = ""
  ) {
    const params = {
      pageNumber,
      pageSize,
      phoneNumber: phoneNumber || "",
    };

    if (sortDirection && sortProperty) {
      params.sortDirection = sortDirection;
      params.sortProperty = sortProperty;
    }

    if (startDateStr) {
      params.startDateStr = startDateStr;
    }
    if (endDateStr) {
      params.endDateStr = endDateStr;
    }

    return axios.get(`${URL}/api/messages/getAll`, {
      params,
      ...config,
    });
  }

  updateMessagesByPhoneNumber(phoneNumber) {
    return axios.get(`${URL}/api/messages/updateMessagesByPhoneNumber`, {
      params: {
        phoneNumber,
      },
      ...config,
    });
  }
}
