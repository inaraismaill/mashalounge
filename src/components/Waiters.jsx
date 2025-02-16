import React, { useEffect, useState } from "react";
import { WaiterService } from "../services/waiterService";
import { useNavigate } from "react-router-dom";
import s from "../styles/Waiters/Waiter.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Modal,
  Box,
  Button,
  TextField,
} from "@mui/material";

const Waiter = () => {
  const navigate = useNavigate();
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await new WaiterService().getAll();
        if (response.data.success && response.data.data.content.length > 0) {
          setWaiters(response.data.data.content);
        } else {
          setWaiters([]);
        }
      } catch (err) {
        setError("An error while fetching the waiters.");
      } finally {
        setLoading(false);
      }
    };

    fetchWaiters();
  }, []);

  const handleWaiterClick = (waiterId) => {
    navigate(`/waiter-details/${waiterId}`);
  };

  const handleOpenModal = (waiter) => {
    setSelectedWaiter(waiter);
    setNewPhoneNumber(waiter.phoneNumber);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedWaiter(null);
    setNewPhoneNumber("");
  };

  const handleUpdate = async () => {
    if (selectedWaiter) {
      try {
        await new WaiterService().update(selectedWaiter.id, newPhoneNumber);
        setWaiters((prevWaiters) =>
          prevWaiters.map((waiter) =>
            waiter.id === selectedWaiter.id
              ? { ...waiter, phoneNumber: newPhoneNumber }
              : waiter
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

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

  return (
    <div>
      <TableContainer>
        <div className={s.TableHeader}>
          <h2>Waiters</h2>
        </div>
        <Table>
          <TableHead>
            <TableRow className={s.thead}>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {waiters.length > 0 ? (
              waiters.map((waiter, index) => (
                <TableRow
                  key={index}
                  className={s.tbody}
                  onClick={() => handleWaiterClick(waiter.id)}
                >
                  <TableCell>
                    <span>{waiter.id}</span>
                  </TableCell>
                  <TableCell>{waiter.fullName}</TableCell>
                  <TableCell>
                    <span>{waiter.phoneNumber}</span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(waiter);
                      }}
                    >
                      Update
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid  #4b5675",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Update Phone Number
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
          />
          <button className={s.uptadeBtn} onClick={handleUpdate}>
            Update
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Waiter;
