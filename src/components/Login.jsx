import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/userService";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "../assets/svg/GoogleIcon.jsx";
import AppleIcon from "../assets/svg/AppleIcon.jsx";
import { useDispatch } from "react-redux";
import { addWaiter } from "../app/features/orderSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMessage("Please fill in both username and password.");
      return;
    }

    const data = { username, password };
    const userService = new UserService();

    try {
      setLoading(true);
      const res = await userService.login(data);

      if (res.status === 200) {
        const { jwtToken, employeeId, positionName, id, firstName, lastName } =
          res.data.data;

        const userData = {
          jwtToken,
          name: firstName + " " + lastName,
          id,
          employeeId,
          positionName,
        };
        console.log("positionId:", employeeId);
        console.log("positionName:", positionName);
        dispatch(addWaiter({ employeeId, positionName }));

        localStorage.setItem("userData", JSON.stringify(userData));

          navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 7,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "white",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Typography variant="h4" textAlign="center" mb={2}>
        Sign In
      </Typography>
      <Typography variant="body2" textAlign="center" mb={3}>
        Need an account?
        <Link href="/signup" underline="hover">
          Sign up
        </Link>
      </Typography>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ flex: 1, textTransform: "none" }}
        >
          Use Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<AppleIcon />}
          sx={{ flex: 1, textTransform: "none" }}
        >
          Use Apple
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <TextField
        label="Password"
        variant="outlined"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <FormControlLabel control={<Checkbox />} label="Remember me" />
        <Link href="#" underline="hover">
          Forgot Password?
        </Link>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>
    </Box>
  );
}
