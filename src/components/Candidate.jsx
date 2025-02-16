import { useState } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
import { CandidateService } from "../services/candidateService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCandidate } from "../app/features/orderSlice";

const Candidate = () => {
  const candidateService = new CandidateService();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    count: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false); 
  const phonePattern = /^\+994\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, count } = formData;

    if (!phoneNumber || !count) {
     
      setError("Phone number and count are required.");
      return;
    }

    if (!phonePattern.test(phoneNumber)) {
      setError("Phone number must be in the format +994 XXX XX XX XX.");
      return;
    }

    if (isNaN(count) || Number(count) <= 0) {
      setError("Count must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.getAll(
        0,
        phoneNumber.replace(/\s+/g, ''), 
        1, 
        "phoneNumber", 
        "asc" 
      );

      if (response?.data?.data?.length > 0) {
        const candidateId = response?.data?.data[0]?.id;
        const fullName = response?.data?.data[0]?.firstName+" "+response?.data?.data[0]?.lastName
        dispatch(
          addCandidate({
            candidateId,
            candidateName: fullName,
            count: Number(count),
          })
        );
        navigate("/order");
      } else {
        if (!firstName || !lastName) {
          setIsPhoneValid(true)
          setError("First name and last name are required.");
          return;
        }

        const saveResponse = await candidateService.save({
          firstName,
          lastName,
          phoneNumber,
        });

        const candidateId = saveResponse?.data?.data?.id;
        const fullName = `${firstName} ${lastName}`;

        if (saveResponse?.data.success) {
          dispatch(
            addCandidate({
              candidateId,
              candidateName: fullName,
              count: Number(count),
            })
          );
          setFormData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            count: "",
          });
          alert("Candidate saved successfully!");
          navigate("/order");
        } else {
          setError(saveResponse?.message || "Failed to save the candidate.");
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" sx={{ pt: 5 }} >
        Add Candidate Information
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {isPhoneValid && (
          <>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="text"
              variant="outlined"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="text"
              variant="outlined"
            />
          </>
        )}

        {[
          {
            label: "Phone Number",
            name: "phoneNumber",
            type: "text",
            required: true,
            inputProps: { pattern: phonePattern.source, maxLength: 19 },
          },
          {
            label: "Count",
            name: "count",
            type: "number",
            required: true,
            inputProps: { min: 1 },
          },
        ].map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={field.required}
            type={field.type}
            inputProps={field.inputProps}
            variant="outlined"
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add"}
        </Button>
      </form>
    </Container>
  );
};

export default Candidate;
