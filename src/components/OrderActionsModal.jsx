import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ActionModal = ({ open, handleClose, orderId, updateIsIgnore }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          border: "none",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Choose an action
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              updateIsIgnore(orderId);
              handleClose();
            }}
          >
            Ignore
          </Button>
          <Link
            to={`/listCanidates/${orderId}`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained" color="success" onClick={handleClose}>
              Add Candidate
            </Button>
          </Link>
        </Box>
      </Box>
    </Modal>
  );
};

export default ActionModal;
