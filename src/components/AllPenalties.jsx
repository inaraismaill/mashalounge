import { useEffect, useState } from "react";
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
  TableFooter,
  TextField,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { TbLockX } from "react-icons/tb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Waiters/WaiterPenalty.css";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const AllPenalties = () => {
  const { waiterId } = useParams();
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState([]);
  const [code, setCode] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPenalties, setTotalPenalties] = useState(0);
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const [addopen, setAddopen] = useState(false);
  const [formData, setFormData] = useState({
    waitId: 0,
    description: "",
    penaltyAmount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "penaltyAmount" ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    if (formData.penaltyAmount <= 0) {
      return alert("Penalty amount must be greater than zero!");
    }

    try {
      const waiterService = new WaiterService();
      const res = await waiterService.save(formData);
      if (res.status === 200) {
        console.log("Kaydedilen veri:", res.data);
       handleClose()
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving the data.");
    }
  };
  const [close, setClose] = useState(true);

  const handleCloseAdd = () => {
    setFormData({ waitId: 0, description: "", penaltyAmount: 0 });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCode("");
  };

  const handleDeactivate = async () => {
    if (selectedPenalty.length === 0) {
      toast.error("Please select at least one penalty.");
      return;
    }

    try {
      const response = await new WaiterService().sendCodeForDeactivatePenalty();

      if (response.data.success) {
        setIsDeactivating(true);
        toast.success("Code sent!");
        handleOpen();
      } else {
        toast.error("Failed to send code");
      }
    } catch (error) {
      toast.error("An error occurred while sending the code");
    }
  };

  const handleSetPaid = async () => {
    if (selectedPenalty.length === 0) {
      toast.error("Please select at least one penalty.");
      return;
    }

    try {
      const response = await new WaiterService().sendCodeForDeactivatePenalty();

      if (response.data.success) {
        setIsDeactivating(false);
        toast.success("Code sent!");
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
      const requestData = {
        code: code,
        waiterPenaltiesId: selectedPenalty,
      };

      const response = await new WaiterService().verifyCodeForDeactivatePenalty(
        requestData
      );

      if (response.data.success) {
        toast.success("Penalty successfully deactivated!");
        handleClose();
        fetchPenalties();
      } else {
        toast.error("Failed to deactivate the penalty. Incorrect code.");
      }
    } catch (error) {
      toast.error("An error occurred while deactivating the penalty.");
      console.log(requestData);
    }
  };

  const handleModalSetPaid = async () => {
    if (!code) {
      toast.error("Please enter the verification code.");
      return;
    }

    try {
      const requestData = {
        code: code,
        waiterPenaltiesId: selectedPenalty,
      };

      const response =
        await new WaiterService().verificationCodeForSetPayedPenalties(
          requestData
        );

      if (response.data.success) {
        toast.success("Penalty successfully set to paid!");
        handleClose();
        fetchPenalties();
      } else {
        toast.error("Failed to set the penalty to paid. Incorrect code.");
      }
    } catch (error) {
      toast.error("An error occurred while setting the penalty to paid.");
      console.log(requestData);
    }
  };

  const fetchPenalties = async () => {
    setLoading(true);
    try {
      const response = await new WaiterService().findAll(
        pageNumber,
        rowsPerPage,
        startDateStr,
        endDateStr,
        sortConfig.key,
        sortConfig.direction
      );
      if (response.data.success) {
        setPenalties(response.data.data.content);
        setCount(response.data.data.totalElements);
      } else {
        setPenalties([]);
      }
    } catch (err) {
      setError("An error occurred while fetching penalties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenalties();
  }, [
    waiterId,
    pageNumber,
    rowsPerPage,
    startDateStr,
    endDateStr,
    sortConfig.key,
    sortConfig.direction,
  ]);

  const handleSelectPenalty = (penaltyId) => {
    setSelectedPenalty((prevSelected) => {
      if (prevSelected.includes(penaltyId)) {
        return prevSelected.filter((id) => id !== penaltyId);
      } else {
        return [...prevSelected, penaltyId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPenalty.length === penalties.length) {
      setSelectedPenalty([]);
    } else {
      const allPenaltyIds = penalties.map((penalty) => penalty.id);
      const newSelectedPenalty = [
        ...new Set([...selectedPenalty, ...allPenaltyIds]),
      ];
      setSelectedPenalty(newSelectedPenalty);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleEndDateChange = (e) => {
    setEndDateStr(e.target.value);
  };

  useEffect(() => {
    fetchPenalties();
  }, [
    waiterId,
    pageNumber,
    pageSize,
    startDateStr,
    endDateStr,
    sortConfig.key,
    sortConfig.direction,
  ]);

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
    <>
      <TableContainer className="TableHeader">
        <div className="headeroftable">
          <h3>Crews All Penalties</h3>
          <div className="dateoffilter">
            <div>
              <span>from: </span>
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
              />
            </div>
            <div>
              <span>to: </span>
              <input
                type="date"
                value={endDateStr}
                onChange={(e) => handleEndDateChange(e)}
              />
            </div>
          </div>
          <div className="actionbtns">
            {selectedPenalty.length > 0 && (
              <>
                <button onClick={handleSelectAll}>
                  <span>Select All</span>
                </button>
                <button onClick={handleDeactivate}>
                  <TbLockX /> <span>Deactivate</span>
                </button>
                <button onClick={handleSetPaid}>
                  <TbLockX /> <span>Set Paid</span>
                </button>
              </>
            )}
          </div>
          <Button variant="contained" onClick={() => setClose(!close)}>
            Add Penalty
          </Button>
        </div>
        <Table>
          <TableHead className="thead">
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="datesorting">
                <div className="thead">
                  <p>ID</p>
                  <span>
                    <IoIosArrowUp
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "id" &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc";
                        setSortConfig({
                          key: "id",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "id" &&
                          sortConfig.direction === "asc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                    <IoIosArrowDown
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "id" &&
                          sortConfig.direction === "desc"
                            ? "asc"
                            : "desc";
                        setSortConfig({
                          key: "id",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "id" &&
                          sortConfig.direction === "desc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                  </span>
                </div>
              </TableCell>
              <TableCell>Crew Name</TableCell>
              <TableCell className="datesorting">
                <div className="thead">
                  <p>Date and Time</p>
                  <span>
                    <IoIosArrowUp
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "createdAt" &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc";
                        setSortConfig({
                          key: "createdAt",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "createdAt" &&
                          sortConfig.direction === "asc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                    <IoIosArrowDown
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "createdAt" &&
                          sortConfig.direction === "desc"
                            ? "asc"
                            : "desc";
                        setSortConfig({
                          key: "createdAt",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "createdAt" &&
                          sortConfig.direction === "desc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                  </span>
                </div>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Penalty Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="tbody">
            {penalties.map((penalty) => (
              <TableRow key={penalty.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPenalty.includes(penalty.id)}
                    onChange={() => handleSelectPenalty(penalty.id)}
                  />
                </TableCell>
                <TableCell>
                  <span>{penalty.id}</span>
                </TableCell>
                <TableCell>{penalty.waiterFullName}</TableCell>
                <TableCell>
                  <div>{penalty.checkDate}</div>
                  <br />
                  <div>{penalty.openTime}</div>
                </TableCell>
                <TableCell>{penalty.description}</TableCell>
                <TableCell>
                  <span>{penalty.penaltyAmount} ₼</span>
                </TableCell>
                <TableCell>
                  <span>{penalty.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <div className="paginationContainer">
                  <div className="paginationControls">
                    <span>Show</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                      className="rowsPerPageSelect"
                    >
                      <option className="option" value={20}>
                        20
                      </option>
                      <option className="option" value={50}>
                        50
                      </option>
                      <option className="option" value={100}>
                        100
                      </option>
                    </select>
                    <span>per page</span>
                  </div>
                  <div className="leftPag">
                    <div className="paginationInfo">
                      {count > 0 && (
                        <span>
                          {Math.min(pageNumber * rowsPerPage + 1, count)}-
                          {Math.min((pageNumber + 1) * rowsPerPage, count)} of{" "}
                          {count}
                        </span>
                      )}
                    </div>
                    <div className="pagination">
                      <button
                        onClick={() =>
                          setPageNumber(Math.max(pageNumber - 1, 0))
                        }
                        disabled={pageNumber === 0}
                        className={
                          pageNumber === 0
                            ? `arrowButton disabledArrow`
                            : `arrowButton activeArrow`
                        }
                      >
                        <FaLongArrowAltLeft className="arrowIcon" />
                      </button>

                      {Array.from(
                        {
                          length: Math.min(5, Math.ceil(count / rowsPerPage)),
                        },
                        (_, i) => {
                          const page = Math.max(
                            0,
                            Math.min(
                              Math.ceil(count / rowsPerPage) - 1,
                              pageNumber + i
                            )
                          );
                          return (
                            <button
                              key={page}
                              className={
                                page === pageNumber
                                  ? `activePage`
                                  : `pageButton`
                              }
                              onClick={() => setPageNumber(page)}
                            >
                              {page + 1}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setPageNumber(
                            Math.min(
                              pageNumber + 1,
                              Math.ceil(count / rowsPerPage) - 1
                            )
                          )
                        }
                        disabled={
                          pageNumber >= Math.ceil(count / rowsPerPage) - 1
                        }
                        className={
                          pageNumber >= Math.ceil(count / rowsPerPage) - 1
                            ? `arrowButton disabledArrow`
                            : `arrowButton activeArrow`
                        }
                      >
                        <FaLongArrowAltRight className="arrowIcon" />
                      </button>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleCloseAdd}>
        <Box sx={{ ...modalStyle, p: 2 }}>
          <Typography variant="h6" mb={2}>
            Update Penalty
          </Typography>
          <TextField
            fullWidth
            label="Waiter ID"
            type="number"
            name="waitId"
            value={formData.waitId}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Penalty Amount"
            type="number"
            name="penaltyAmount"
            value={formData.penaltyAmount}
            onChange={handleChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AllPenalties;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
};
