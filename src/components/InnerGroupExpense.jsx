import { useEffect, useState } from "react";
import { InnerGroupExpenseService } from "../services/innerGroupExpenseService";
import { useNavigate, useParams } from "react-router-dom";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
} from "mdb-react-ui-kit";

const InnerGroupExpense = () => {
  const [datas, setDatas] = useState({});
  const [pageNumber, setPageNumber] = useState(0);
  const [name, setName] = useState("");
  const [response, setResponse] = useState({});
  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  const { id } = useParams();
  const toggleOpen = () => setBasicModal(!basicModal);

  const handleSubmit = () => {
    const innerGroupExpensesService = new InnerGroupExpenseService();

    const data = {
      name,
      groupExpense: {
        id,
      },
    };

    innerGroupExpensesService
      .save(data)
      .then((res) => {
        if (res.status === 200) {
          setResponse(res.data);
          alert("Successfuly saved");
          toggleOpen();
          setName("");
        }
      })
      .catch(() => navigate("/login"));
  };

  useEffect(() => {
    const innerGroupExpensesService = new InnerGroupExpenseService();

    innerGroupExpensesService.findAllByGroupId(id, pageNumber).then((res) => {
      setDatas(res.data.data);
    });
  }, [pageNumber, response]);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <MDBBtn onClick={toggleOpen} className="me-1" color="success">
          Add
        </MDBBtn>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {datas.content?.map((data, i) => (
            <tr key={data.id}>
              <td>{i + 1 + 50 * pageNumber}</td>
              <td>{data?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pageNumber === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Previous
            </button>
          </li>
          <li
            className={`page-item ${
              (pageNumber + 1) * 50 > datas.totalElements ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      <MDBModal
        open={basicModal}
        onClose={() => setBasicModal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <MDBInput
                onChange={(e) => setName(e.target.value)}
                value={name}
                label="Name"
                id="form1"
                type="text"
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSubmit}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default InnerGroupExpense;
