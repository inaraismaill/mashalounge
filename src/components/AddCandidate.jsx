import { useEffect, useState } from "react";
import { MDBInput, MDBBtn, MDBRange } from "mdb-react-ui-kit";
import { useLocation, useNavigate } from "react-router-dom";
import { CandidateService } from "../services/candidateService";
import { OrderService } from "../services/orderService";

const AddCandidate = () => {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countCandidates, setCountCandidates] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const location = useLocation();

  // Get a specific query parameter
  const phoneNumber = new URLSearchParams(location.search).get("phoneNumber");
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      phoneNumber: phoneNumber,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);

    const candidateService = new CandidateService();
    candidateService
      .save(formData)
      .then((res) => {
        setIsButtonDisabled(false);
        if (res.status === 200) {
          setFormData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
          });

          if (phoneNumber) {
            const orderService = new OrderService();
            const values = {
              orderId: parseInt(orderId),
              candidateId: parseInt(res.data.data.id),
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
          }
          navigate("/");
        } else if (res.status === 403) {
          navigate("/login");
        }
      })
      .catch((err) => {
        alert("Candidate already exists");
        setIsButtonDisabled(false); // Re-enable the button in case of error
      });
  };

  return (
    <form style={{ width: "40%", margin: "auto" }}>
      <MDBInput
        className="mb-4"
        label="First Name"
        icon="user"
        type="text"
        validate
        error="wrong"
        success="right"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <MDBInput
        className="mb-4"
        label="Last Name"
        icon="user"
        type="text"
        validate
        error="wrong"
        success="right"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <MDBInput
        className="mb-4"
        label="Phone Number"
        icon="phone"
        type="text"
        validate
        error="wrong"
        success="right"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      {phoneNumber ? (
        <MDBRange
          defaultValue={1}
          min="1"
          max="20"
          step="1"
          id="customRange3"
          label="Enter count of candidates"
          onChange={(e) => setCountCandidates(e.target.value)}
        />
      ) : null}

      <div className="text-center">
        <MDBBtn
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          type="button"
        >
          Submit
        </MDBBtn>
      </div>
    </form>
  );
};

export default AddCandidate;
