import React, { useState } from "react";
import { ReportService } from "../services/reportService";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";

const Report = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [datas, setDatas] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatDateToLocalDateTime = (date) => {
    return `${date}T00:00:00`;
  };

  const handleSubmit = () => {
    const reportService = new ReportService();
    const formattedStartDate = formatDateToLocalDateTime(startDate);
    const formattedEndDate = formatDateToLocalDateTime(endDate);

    reportService
      .findReportByDate(formattedStartDate, formattedEndDate)
      .then((res) => {
        setDatas(res.data.data);
      });
  };

  const handleSendMessage = () => {
    const reportService = new ReportService();
    const formattedStartDate = formatDateToLocalDateTime(startDate);
    const formattedEndDate = formatDateToLocalDateTime(endDate);

    const data = {
      phoneNumber,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    reportService.reportToPhoneNumber(data).then((res) => {
      if (res.status === 200) {
        alert("Successfully sent");
      }
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h2>Start date</h2>
          <MDBInput
            className="mb-4"
            type="date"
            name="openCheckAt"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <h2>End date</h2>
          <MDBInput
            className="mb-4"
            type="date"
            name="openCheckAt"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <MDBBtn onClick={handleSubmit}>Find</MDBBtn>
      </div>

      {datas ? (
        <div>
          <div style={{display:"flex", justifyContent:"space-around"}}>
            <div>
              <div>
                <h3>Order</h3>
                <div>
                  <p>Count orders: {datas?.reportOrder?.countOrders}</p>
                  <p>Total amount: {datas?.reportOrder?.totalAmount}</p>
                </div>
              </div>
            </div>
            <div>
              <div>
                <h3>Costumer type</h3>
                <div>
                  <p>
                    Count returned costumer:{" "}
                    {datas?.reportCostumerType?.countReturned}
                  </p>
                  <p>
                    Count new costumer: {datas?.reportCostumerType?.countNew}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "40px" }}>
            <h3>Employee Sell Amounts</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee name</th>
                  <th>Count orders</th>
                  <th>Total amount</th>
                </tr>
              </thead>
              <tbody>
                {datas?.employeeNameAndTotalAmount.map((data, i) => (
                  <tr key={data.id}>
                    <td>{i + 1}</td>
                    <td>{data?.employeeName}</td>
                    <td>{data?.countOrders}</td>
                    <td>{data?.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "40px" }}>
            <h3>Employee Average Sell Amount</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee name</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {datas?.reportEmployeeAndAverageAmount.map((data, i) => (
                  <tr key={data.id}>
                    <td>{i + 1}</td>
                    <td>{data?.employeeName}</td>
                    <td>{data?.averageAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "40px" }}>
            <h3>Employee Ignore Order Count</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee name</th>
                  <th>Ignore count</th>
                </tr>
              </thead>
              <tbody>
                {datas?.employeeNameAndIgnoreCount.map((data, i) => (
                  <tr key={data.id}>
                    <td>{i + 1}</td>
                    <td>{data?.employeeName}</td>
                    <td>{data?.ignoreCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3>Employee And Hall</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee name</th>
                  <th>Hall</th>
                </tr>
              </thead>
              <tbody>
                {datas?.reportEmployeeAndTables.map((data, i) => (
                  <tr key={data.id}>
                    <td>{i + 1}</td>
                    <td>{data?.employeeName}</td>
                    <td>
                      <p>{Array.from(data?.tableNames).join(", ")}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3>Hall Details</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hall</th>
                  <th>Total amount</th>
                  <th>Count orders</th>
                </tr>
              </thead>
              <tbody>
                {datas?.reportHalls.map((data, i) => (
                  <tr key={data.id}>
                    <td>{i + 1}</td>
                    <td>{data?.hallName}</td>
                    <td>{data?.sellingPrice}</td>
                    <td>{data?.countOrders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3>Items Sell Count</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item name</th>
                  <th>Sell count</th>
                </tr>
              </thead>
              <tbody>
                {datas?.reportItems.map((data, i) => (
                  <tr key={data.id}>
                    <td>{i + 1}</td>
                    <td>{data?.itemName}</td>
                    <td>{data?.itemCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "40px" }}>
            <div style={{ marginBottom: "40px" }}>
              <MDBInput
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                label="Phone number"
                id="form1"
                type="text"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MDBBtn onClick={handleSendMessage}>Send report</MDBBtn>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Report;
