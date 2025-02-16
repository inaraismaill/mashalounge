import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Backspace } from "@mui/icons-material";
import { PincodeService } from "../services/pincodeService.js";

export default function WaiterLogin() {
  const pincodeService = new PincodeService();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [userName, setUserName] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("Şifrəni daxil edin"); 

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userData"));
    if (userdata.name) {
      setUserName(userdata.name);
    }

    const uuid = localStorage.getItem("uuid");
    const confirmed = sessionStorage.getItem("confirmed");
    if (uuid && confirmed === "true") {
      navigate("/waiter-order");
    }
  }, [navigate]);

  const handleKeyPress = (value) => {
    if (password.length < 4) {
      setPassword((prev) => prev + value);
    }
  };

  const handleBackspace = () => {
    setPassword((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (password.length === 4) {
      handleSubmit();
    }
  }, [password]);

  const handleSubmit = async () => {
    if (password.length !== 4) {
      setErrorMessage("Şifrə tam deyil.");
      return;
    }

    let uuid = localStorage.getItem("uuid");
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem("uuid", uuid);
    }

    const requestData = { code: password.trim(), uuid };

    pincodeService
      .verify(requestData)
      .then((response) => {
        if (response.data.success) {
          if (response.data.message === "Pincode matches") {
            sessionStorage.setItem("confirmed", "true");
            setSavedMessage("Şifrə yadda saxlanıldı.");
            setInputMessage("Şifrə daxil olundu, zəhmət olmasa təkrarlayın"); 
            navigate("/waiter-order");
          } else {
            setServerError(
              "Şifrə uyğun gəlmir. Zəhmət olmasa yenidən cəhd edin."
            );
          }
        }
      })
      .catch((error) => {
        if (error.response?.status === 500) {
          pincodeService
            .save(requestData)
            .then(() => {
              sessionStorage.setItem("confirmed", "false");
              setServerError("Şifrə yadda saxlanıldı.");
              navigate("/waiter-order");
            })
            .catch(() => {
              setServerError(
                "Şifrəni yadda saxlamaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin."
              );
            });
        } else {
          setServerError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
        }
      });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        gap: 2,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ fontWeight: "900", fontSize: "30px", color: "#61617c", py: 1 }}
      >
        {userName ? `${userName}` : "Ad Soyad"}
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        {[...Array(4)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              backgroundColor: password.length > index ? "#333" : "#ddd",
            }}
          ></Box>
        ))}
      </Box>

      <Typography
        variant="body2"
        textAlign="center"
        color="textSecondary"
        sx={{ my: 2 }}
      >
        {inputMessage}
      </Typography>
      {password.length === 4 &&
        !serverError &&
        !errorMessage &&
        !savedMessage && (
          <Typography color="success" variant="body2">
            Şifrə daxil olundu. Zəhmət olmasa təkrarlayın
          </Typography>
        )}

      {savedMessage && (
        <Typography color="success" variant="body2">
          {savedMessage}
        </Typography>
      )}

      {serverError && (
        <Typography color="error" variant="body2">
          {serverError}
        </Typography>
      )}

      {errorMessage && (
        <Typography color="error" variant="body2">
          {errorMessage}
        </Typography>
      )}

      <Box
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          width: "100%",
          maxWidth: 200,
        }}
      >
        {[...Array(9)].map((_, index) => (
          <div
            key={index + 1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 55,
              color: "#61617c",
              fontWeight: "900",
              height: 45,
              backgroundColor: "#ebeaef",
              borderRadius: 2,
              fontSize: 20,
              cursor: "pointer",
              userSelect: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            onClick={() => handleKeyPress((index + 1).toString())}
          >
            {index + 1}
          </div>
        ))}
        <Box></Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 55,
            color: "#61617c",
            fontWeight: "900",
            height: 45,
            backgroundColor: "#ebeaef",
            borderRadius: 2,
            fontSize: 20,
            cursor: "pointer",
            userSelect: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
          onClick={() => handleKeyPress("0")}
        >
          0
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 55,
            color: "#61617c",
            fontWeight: "900",
            height: 45,
            backgroundColor: "#ebeaef",
            borderRadius: 2,
            fontSize: 20,
            cursor: "pointer",
            userSelect: "none",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
          onClick={handleBackspace}
        >
          <Backspace />
        </Box>
      </Box>
    </Box>
  );
}
