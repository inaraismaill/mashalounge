import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRange
} from "mdb-react-ui-kit";
import {} from "mdb-react-ui-kit";
import { CandidateService } from "../services/candidateService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { OrderService } from "../services/orderService";

const ListCandidate = () => {
  const [datas, setDatas] = useState([]);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const [candidateId, setCandidateId] = useState();
  const [countCandidates,setCountCandidates] = useState(1);
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);


  useEffect(() => {
    const candidateService = new CandidateService();
    setTimeout(() => {
      candidateService
        .findByFirstNameContainsIgnoreCase(firstName)
        .then((res) => setDatas(res.data.data))
        .catch(() => navigate("/login"));
    }, 1200);
  }, [firstName]);

  const handleToggle = (id) => {
    toggleOpen();
    setCandidateId(id);
  };

  const linkWithCandidate = () => {
    const orderService = new OrderService();
    const values = {
      orderId: parseInt(orderId),
      candidateId: parseInt(candidateId),
      countCandidates: parseInt(countCandidates),
    };
    orderService
      .updateOrderByCandidateId(values)
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
        }
        toggleOpen();
      })
      .catch(() => navigate("/login"));
  };
  return (
    <div>
      <div style={{display:"flex", gap:"50px"}}>
      <MDBInput
        onChange={(e) => setFirstName(e.target.value)}
        label="Find By Fist Name or Phone number"
        id="form1"
        type="text"
      />
      <Link
      to={{
        pathname: '/addCandidate',
        search: `?phoneNumber=${encodeURIComponent(firstName)}&orderId=${orderId}`,
      }}
    >
      <MDBBtn>Add candidate</MDBBtn>
    </Link>
      </div>
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First name</th>
            <th scope="col">Last name</th>
            <th scope="col">Phone number</th>
            <th scope="col">Button</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {datas.map((data, i) => (
            <tr key={i}>
              <th scope="row">{i + 1}</th>
              <td>{data.firstName}</td>
              <td>{data.lastName}</td>
              <td>{data.phoneNumber}</td>
              <td>
                <MDBBtn
                  onClick={() => handleToggle(data.id)}
                  className="me-1"
                  color="success"
                >
                  Link with check
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      {/*Modlas code*/}
      <MDBModal
        open={basicModal}
        onClose={() => setBasicModal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {" "}
              <MDBRange
                defaultValue={1}
                min="1"
                max="20"
                step="1"
                id="customRange3"
                label="Enter count of candidates"
                onChange={(e) => setCountCandidates(e.target.value)}
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn color="success" onClick={linkWithCandidate}>
                Link
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default ListCandidate;
