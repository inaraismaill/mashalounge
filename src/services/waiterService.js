import axios from "axios";
import { URL } from "../static/URL";

const token = JSON.parse(localStorage.getItem("userData"))?.jwtToken;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export class WaiterService {

  save(data) {
    return axios.post(`${URL}/api/waiterPenalty/createPenaltyManual`, data, config);
  }

  getAll(
    pageNumber = 0,
    pageSize = 10,
    sortDirection = "",
    sortProperty = "",
    startDateStr = "",
    endDateStr = ""
  ) {
    const params = {
      pageNumber,
      pageSize,
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

    return axios.get(`${URL}/api/waiters/getAll`, {
      params,
      ...config,
    });
  }

  update(id, phoneNumber) {
    return axios.put(
      `${URL}/api/waiters/update?id=${id}`,
      { phoneNumber },
      {
        ...config,
      }
    );
  }

  findByWaiterId(waiterId, pageNumber = 0, pageSize = 10) {
    return axios.get(
      `${URL}/api/waiterPenalty/findByWaiterId?waiterId=${waiterId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        ...config,
      }
    );
  }

  sendCodeForDeactivatePenalty() {
    return axios.get(`${URL}/api/waiterPenalty/sendCodeForDeactivatePenalty`, {
      ...config,
    });
  }

  verifyCodeForDeactivatePenalty(requestData) {
    return axios.put(
      `${URL}/api/waiterPenalty/verificationCodeForDeactivatePenalty`,
      requestData,
      {
        ...config,
      }
    );
  }

  verificationCodeForSetPayedPenalties(requestData) {
    return axios.put(
      `${URL}/api/waiterPenalty/verificationCodeForSetPayedPenalties`,
      requestData,
      {
        ...config,
      }
    );
  }

  findAll(
    pageNumber = 0,
    pageSize = 100,
    startDateStr = "",
    endDateStr = "",
    sortProperty = "",
    sortDirection = ""
  ) {
    const params = {
      pageNumber,
      pageSize,
    };

    if (startDateStr) {
      params.startDate = startDateStr;
    }

    if (endDateStr) {
      params.endDate = endDateStr;
    }

    if (sortProperty) {
      params.sortProperty = sortProperty;
    }

    if (sortDirection) {
      params.sortDirection = sortDirection;
    }

    return axios.get(`${URL}/api/waiterPenalty/findAll`, {
      params,
      ...config,
    });
  }
}
