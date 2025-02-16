import React, { useState, useEffect } from "react";
import { OrderService } from "../services/orderService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PresentServie } from "../services/presentService";
import { CandidateService } from "../services/candidateService";
import { MessageService } from "../services/messageService";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Switch,
  Link as MuiLink,
  FormControlLabel,
  TableFooter,
  Typography,
  TableContainer,
  Paper,
  Box,
  IconButton,
  TextField,
  Modal,
} from "@mui/material";
import style from "../styles/CandidateDetails/CandidateDetail.module.css";
import { RiAccountCircleFill } from "react-icons/ri";
import InfoEdit from "../assets/svg/İnfoEdit";
import { CiCalendarDate } from "react-icons/ci";
import { CiTimer } from "react-icons/ci";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import { message } from "antd";

function CandidateDetails() {
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumberMessages, setPageNumberMessages] = useState(0);
  const { id } = useParams();
  const [clickedButton, setClickedButton] = useState(false);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [presents, setPresents] = useState([]);
  const [cashback, setCashback] = useState(0);
  const [candidate, setCandidate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [messageLogs, setMessageLogs] = useState([]);

  const letterColors = {
    H: {
      color: "green",
      backgroundColor: "rgba(0, 128, 0, 0.37)",
      borderColor: "green",
    },
    T: {
      color: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.37)",
      borderColor: "blue",
    },
    S: {
      color: "orange",
      backgroundColor: "rgba(255, 165, 0, 0.37)",
      borderColor: "orange",
    },
    K: {
      color: "purple",
      backgroundColor: "rgba(128, 0, 128, 0.37)",
      borderColor: "purple",
    },
    B: {
      color: "red",
      backgroundColor: "rgba(255, 0, 0, 0.37)",
      borderColor: "red",
    },
  };

  const updatePresent = (presentId) => {
    const presentService = new PresentServie();
    const data = { id: presentId, status: false };
    presentService.update(data);
  };

  const updateCashback = () => {
    const candidateService = new CandidateService();
    const data = { id: id, cashbackAmount: parseFloat(cashback) };
    candidateService
      .updateCashback(data)
      .then((res) => console.log(res.data.data));
    setShowModal(false);
  };

  useEffect(() => {
    const orderService = new OrderService();
    const fetchOrders = clickedButton
      ? orderService.findByCandidateIdOrderByOpenCheckAtCandidateDesc(
          id,
          pageNumber,
          pageSize
        )
      : orderService.findByCandidateIdOrderByOpenCheckAtCandidateAsc(
          id,
          pageNumber,
          pageSize
        );

    fetchOrders
      .then((res) => setOrders(res.data.data))
      .catch(() => navigate("/login"));
  }, [pageNumber, clickedButton]);

  useEffect(() => {
    const orderService = new OrderService();
    const presentService = new PresentServie();
    const candidateService = new CandidateService();

    orderService
      .getSumAmountsByCandidateId(id)
      .then((res) => setTotalAmount(res.data));
    presentService
      .findByIdAndStatusIsTrue(id)
      .then((res) => setPresents(res.data.data));
    candidateService.findById(id).then((res) => setCandidate(res.data.data));
 
  }, [id]);

  useEffect(() => {
    const messageService = new MessageService();
    messageService
      .findMessageLogsByCandidateId(id, pageNumberMessages)
      .then((res) => setMessageLogs(res.data.data));
   
  }, [pageNumberMessages, id]);

  const handleButtonClick = () => {
    setClickedButton(!clickedButton);
  };

  const handleSwitchChange = (event) => {
    setClickedButton(event.target.checked);
  };

  const handleChangePage = (event, newPage) => {
    setPageNumberMessages(newPage - 1);
  };
  const count = orders?.totalElements || 0;
  const paginatedMessages = messageLogs.slice(
    pageNumberMessages * pageSize,
    (pageNumberMessages + 1) * pageSize
  );
  const totalPages = Math.ceil(messageLogs.length / pageSize);

  return (
    <div>
      <div className={style.candidateDetailTable}>
        <h2>Candidate Detail</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Cashback</TableCell>
              <TableCell>Cashback Percent</TableCell>
              <TableCell>Edit Cashback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Link className={style.id} to={"/" + candidate.candidateId}>
                  <RiAccountCircleFill />
                  <span>{candidate.candidateId}</span>
                </Link>
              </TableCell>
              <TableCell>{candidate.firstName}</TableCell>
              <TableCell>{candidate.lastName}</TableCell>
              <TableCell>
                <span className={style.cashback}> ₼ {candidate.cashback}</span>
              </TableCell>
              <TableCell>
                <span className={style.percent}>
                  {candidate.cashbackPercent}%
                </span>
              </TableCell>
              <TableCell>
                <button
                  className={style.editBtn}
                  variant="contained"
                  onClick={() => setShowModal(true)}
                >
                  <InfoEdit /> Edit Cashback
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className={style.orderListTable}>
        <div className={style.orderTableHeader}>
          <h2>Orders List</h2>
          <FormControlLabel
            control={
              <Switch
                checked={clickedButton}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label={clickedButton ? "Earliest" : "Latest"}
          />
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Doc. Num.</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>C.C</TableCell>
              <TableCell>Order Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.content?.map((order, i) => (
              <TableRow key={order.id}>
                <TableCell>
                  <span className={style.orderNum}>
                    {i + 1 + 10 * pageNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <MuiLink
                    className={style.orderDoc}
                    component={Link}
                    to={`/candidateItms/${order.id}`}
                  >
                    {order.docNumber}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  {order.hallName} - {order.table}
                </TableCell>
                <TableCell>
                  <p className={style.orderEmployeeName}>
                    {order.employeeName}
                  </p>
                </TableCell>
                <TableCell className={style.orderDate}>
                  <p>
                    <CiCalendarDate />
                    {order.date}
                  </p>
                  <p>
                    <CiTimer />
                    {order.time}
                  </p>
                </TableCell>
                <TableCell>
                  <span className={style.orderAmount}>₼ {order.amount}</span>
                </TableCell>
                <TableCell>
                  <span className={style.orderCountC}>
                    {order.countCandidateOrders}
                  </span>
                </TableCell>
                <TableCell className={style.branch}>
                  {order.foodDepartments && order.foodDepartments.length > 0 ? (
                    order.foodDepartments.map((dep, index) => {
                      const firstLetter = dep.name.charAt(0);
                      const colors = letterColors[firstLetter] || {
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.37)",
                        borderColor: "white",
                      };

                      return (
                        <p
                          key={index}
                          style={{
                            position: "relative",
                            left: `${index * -5}px`,
                            color: colors.color,
                            backgroundColor: colors.backgroundColor,
                            border: `1px solid ${colors.borderColor}`,
                          }}
                        >
                          {dep.name}
                        </p>
                      );
                    })
                  ) : (
                    <Typography>No data</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <div className={style.orderPag}>
                  <h3 className={style.orderTotal}>
                    Total amount: <span>{totalAmount} ₼</span>
                  </h3>
                  <div className={style.leftPag}>
                    <div className={style.paginationInfo}>
                      {count > 0 && (
                        <span>
                          {Math.min(pageNumber * pageSize + 1, count)}-
                          {Math.min((pageNumber + 1) * pageSize, count)} of{" "}
                          {count}
                        </span>
                      )}
                    </div>
                    <div className={style.pagination}>
                      <button
                        onClick={() =>
                          setPageNumber(Math.max(pageNumber - 1, 0))
                        }
                        disabled={pageNumber === 0}
                        className={
                          pageNumber === 0
                            ? `${style.arrowButton} ${style.disabledArrow}`
                            : `${style.arrowButton} ${style.activeArrow}`
                        }
                      >
                        <FaLongArrowAltLeft className={style.arrowIcon} />
                      </button>

                      {Array.from(
                        {
                          length: Math.min(5, Math.ceil(count / pageSize)),
                        },
                        (_, i) => {
                          const page = Math.max(
                            0,
                            Math.min(
                              Math.ceil(count / pageSize) - 1,
                              pageNumber + i
                            )
                          );
                          return (
                            <button
                              key={page}
                              className={
                                page === pageNumber
                                  ? style.activePage
                                  : style.pageButton
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
                              Math.ceil(count / pageSize) - 1
                            )
                          )
                        }
                        disabled={pageNumber >= Math.ceil(count / pageSize) - 1}
                        className={
                          pageNumber >= Math.ceil(count / pageSize) - 1
                            ? `${style.arrowButton} ${style.disabledArrow}`
                            : `${style.arrowButton} ${style.activeArrow}`
                        }
                      >
                        <FaLongArrowAltRight className={style.arrowIcon} />
                      </button>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className={style.ActivePresentTable}>
        <h2>Active Presents</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Present</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presents.map((present, i) => (
              <TableRow key={present.id}>
                <TableCell>
                  <span className={style.ActiveorderNum}>
                    {i + 1 + 10 * pageNumber}
                  </span>
                </TableCell>
                <TableCell>{present.name}</TableCell>
                <TableCell>{present.count}</TableCell>
                <TableCell>
                  <Button onClick={() => updatePresent(present.id)}>
                    Deactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className={style.MessageLogsTable}>
        <h3>Message Logs</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Sent At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMessages.map((message, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <p className={style.ActiveorderNum}>
                      {i + 1 + pageNumberMessages * pageSize}
                    </p>
                  </TableCell>
                  <TableCell>{message.message}</TableCell>
                  <TableCell className={style.orderDate}>
                    <p>
                      <CiCalendarDate />
                      {message.sentAtDate}
                    </p>
                    <p>
                      <CiTimer />
                      {message.sentAtTime}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell colSpan={3} className={style.MessagePag}>
                <div className={style.leftPag}>
                  <div className={style.paginationInfo}>
                    {messageLogs.length > 0 && (
                      <span>
                        {Math.min(
                          pageNumberMessages * pageSize + 1,
                          messageLogs.length
                        )}
                        -
                        {Math.min(
                          (pageNumberMessages + 1) * pageSize,
                          messageLogs.length
                        )}{" "}
                        of {messageLogs.length}
                      </span>
                    )}
                  </div>
                  <div className={style.pagination}>
                    <button
                      onClick={() =>
                        setPageNumberMessages(
                          Math.max(pageNumberMessages - 1, 0)
                        )
                      }
                      disabled={pageNumberMessages === 0}
                      className={
                        pageNumberMessages === 0
                          ? `${style.arrowButton} ${style.disabledArrow}`
                          : `${style.arrowButton} ${style.activeArrow}`
                      }
                    >
                      <FaLongArrowAltLeft className={style.arrowIcon} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(
                        0,
                        Math.min(totalPages - 1, pageNumberMessages + i)
                      );
                      return (
                        <Button
                          key={page}
                          className={
                            page === pageNumberMessages
                              ? style.activePage
                              : style.pageButton
                          }
                          onClick={() => setPageNumberMessages(page)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setPageNumberMessages(
                          Math.min(pageNumberMessages + 1, totalPages - 1)
                        )
                      }
                      disabled={pageNumberMessages >= totalPages - 1}
                      className={
                        pageNumberMessages >= totalPages - 1
                          ? `${style.arrowButton} ${style.disabledArrow}`
                          : `${style.arrowButton} ${style.activeArrow}`
                      }
                    >
                      <FaLongArrowAltRight className={style.arrowIcon} />
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>

      {showModal && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="edit-cashback-modal"
          aria-describedby="edit-cashback-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="edit-cashback-modal" variant="h6" component="h2">
              Edit Cashback
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setShowModal(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                type="number"
                label="Enter cashback amount"
                value={cashback}
                onChange={(e) => setCashback(e.target.value)}
                variant="outlined"
                margin="normal"
              />
            </Box>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={updateCashback}
                sx={{ mr: 1 }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default CandidateDetails;
