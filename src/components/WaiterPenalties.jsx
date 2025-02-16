import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { WaiterService } from "../services/waiterService";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { TbLockX } from "react-icons/tb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import s from "../styles/Waiters/WaitersPenalty.module.css";

const WaiterPenalties = () => {
  const { waiterId } = useParams();
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [code, setCode] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCode("");
  };

  const handleDeactivate = async (penaltyId) => {
    try {
      const response = await new WaiterService().sendCodeForDeactivatePenalty(
        penaltyId
      );

      if (response.data.success) {
        toast.success("Code sent!");
        setSelectedPenalty(penaltyId);
        handleOpen();
      } else {
        toast.error("Failed to send code");
      }
    } catch (error) {
      toast.error("An error occurred while sending the code");
    }
  };

  const handleModalDeactivate = async () => {
    if (!code) {
      toast.error("Please enter the verification code.");
      return;
    }

    try {
      const response = await new WaiterService().verifyCodeForDeactivatePenalty(
        selectedPenalty,
        code
      );

      if (response.data.success) {
        toast.success("Penalty successfully deactivated!");
        handleClose();
      } else {
        toast.error("Failed to deactivate the penalty. Incorrect code.");
      }
    } catch (error) {
      toast.error("An error occurred while deactivating the penalty.");
    }
  };

  useEffect(() => {
    const fetchWaiterDetails = async () => {
      try {
        const response = await new WaiterService().findByWaiterId(waiterId);
        if (response.data.success) {
          setPenalties(response.data.data.content);
        } else {
          setPenalties([]);
        }
      } catch (err) {
        setError("An error occurred while fetching waiter details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWaiterDetails();
  }, [waiterId]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  if (penalties.length === 0) {
    return <Typography variant="h6">No waiter penalties found.</Typography>;
  }

  return (
    <TableContainer className={s.TableHeader}>
      <h2>Waiter Penalties</h2>
      <Table>
        <TableHead className={s.thead}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Crew Name</TableCell>
            <TableCell>Date and Time</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Penalty Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={s.tbody}>
          {penalties.map((penalty) => (
            <TableRow key={penalty.id}>
              <TableCell>
                <span>{penalty.id}</span>
              </TableCell>
              <TableCell>{penalty.waiterFullName}</TableCell>
              <TableCell>
                <div>{penalty.checkDate}</div>
                <br />
                <div>{penalty.openTime}</div>
              </TableCell>
              <TableCell>
                <span>{penalty.description}</span>
              </TableCell>
              <TableCell>
                <span>{penalty.penaltyAmount} ₼</span>
              </TableCell>
              <TableCell>
                <span>{penalty.status}</span>
              </TableCell>
              <TableCell>
                <button onClick={() => handleDeactivate(penalty.id)}>
                  <TbLockX /> <span>Deactivate</span>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Enter Verification Code
          </Typography>
          <TextField
            label="Code"
            variant="outlined"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={handleModalDeactivate}
            >
              Deactivate
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </TableContainer>
  );
};

export default WaiterPenalties;
