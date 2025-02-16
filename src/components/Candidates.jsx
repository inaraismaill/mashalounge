import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Switch,
  FormControlLabel,
  Modal,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableFooter,
  CircularProgress,
} from "@mui/material";
import { CandidateService } from "../services/candidateService";
import { Select } from "semantic-ui-react";
import style from "../styles/Candidates/Candidates.module.css";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import StarIcon from "../assets/svg/StarIcon";
import EmptyStar from "../assets/svg/EmptyStar";
import InfoEdit from "../assets/svg/İnfoEdit";
import { RiRefreshLine } from "react-icons/ri";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const SwitchControl = ({ label, checked, onChange, disabled }) => (
  <FormControlLabel
    control={
      <Switch
        checked={checked}
        onChange={onChange}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#1565c0",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#1565c0",
          },
        }}
      />
    }
    label={label}
    disabled={disabled}
  />
);

const ModalForm = ({
  open,
  onClose,
  onSubmit,
  firstName,
  lastName,
  phoneNumber,
  shouldReceive,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setShouldReceive,
  shouldReceives,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        width: 400,
        bgcolor: "background.paper",
        p: 3,
        borderRadius: 2,
        boxShadow: 24,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Update
      </Typography>
      <TextField
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
        label="First name"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
        label="Last name"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        onChange={(e) => setPhoneNumber(e.target.value)}
        value={phoneNumber}
        label="Phone number"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Select
        onChange={(e, data) => setShouldReceive(data.value)}
        placeholder="Should Receive"
        options={shouldReceives}
        value={shouldReceive}
        style={{ width: "100%", marginBottom: "16px" }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  </Modal>
);

function OrdersList() {
  const [datas, setDatas] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shouldReceive, setShouldReceive] = useState();
  const [firstNameOrPhoneNumber, setFirstNameOrPhoneNumber] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const [candidateFilter, setCandidateFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const shouldReceives = [
    { key: "yes", value: true, text: "YES" },
    { key: "no", value: false, text: "NO" },
  ];
  const rankStars = {
    Leytenant: 1,
    Kapitan: 2,
    Mayor: 3,
    Polkovnik: 4,
    General: 5,
  };

  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const candidateService = new CandidateService();
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        let res;
        let totalCount;

        if (candidateFilter === "OrderLess") {
          res =
            await candidateService.findByOrderIsNullAndFullNameContainsIgnoreCase(
              firstNameOrPhoneNumber,
              pageNumber,
              rowsPerPage,
              sortConfig.direction,
              sortConfig.key
            );
          totalCount = await candidateService.countCandidatesByOrderIsNull();
        } else if (candidateFilter === "HavingOrder") {
          res =
            await candidateService.findByOrderIsNotNullAndFullNameContainsIgnoreCase(
              firstNameOrPhoneNumber,
              pageNumber,
              rowsPerPage,
              sortConfig.direction,
              sortConfig.key
            );
          totalCount = await candidateService.countCandidatesByOrderIsNotNull();
        } else {
          res = await candidateService.getAll(
            pageNumber,
            firstNameOrPhoneNumber,
            rowsPerPage,
            sortConfig.key,
            sortConfig.direction
          );
          totalCount = await candidateService.countAllCandidate();
        }

        setDatas(res.data.data || []);
        setCount(totalCount.data || 0);
      } catch (e) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [
    candidateFilter,
    firstNameOrPhoneNumber,
    pageNumber,
    rowsPerPage,
    sortConfig,
  ]);

  const handleModal = (data) => {
    toggleOpen();
    setCandidateId(data.id);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setPhoneNumber(data.phoneNumber);
    setShouldReceive(data.shouldReceive);
  };

  const handleSubmit = async () => {
    const candidateService = new CandidateService();
    const data = {
      id: candidateId,
      firstName,
      lastName,
      phoneNumber,
      shouldReceive,
    };
    try {
      await candidateService.update(data);
      toggleOpen();
      window.location.reload();
    } catch (err) {
      navigate("/login");
    }
  };

  const handleClickOrderless = (value) => {
    setPageNumber(0);
    setCandidateFilter(value);
  };
  return (
    <div>
      <div className={style.switches}>
        <div className={style.switchBox}>
          <h1>Candidates List</h1>
          <SwitchControl
            label="All Candidate"
            checked={candidateFilter === "All"}
            onChange={() => handleClickOrderless("All")}
            disabled={candidateFilter === "All"}
          />
          <SwitchControl
            label="Having Order Candidate"
            checked={candidateFilter === "HavingOrder"}
            onChange={() => handleClickOrderless("HavingOrder")}
            disabled={candidateFilter === "HavingOrder"}
          />
          <SwitchControl
            label="Orderless Candidate"
            checked={candidateFilter === "OrderLess"}
            onChange={() => handleClickOrderless("OrderLess")}
            disabled={candidateFilter === "OrderLess"}
          />
          <div className={style.searchItems}>
            <input
              className={style.searchBar}
              onChange={(e) => {
                setFirstNameOrPhoneNumber(e.target.value);
                setPageNumber(0);
              }}
              placeholder="Find By First Name or Phone Number"
            />
            <button>
              <PersonSearchIcon />
            </button>
          </div>
          <button className={style.addCandidate}>
            <Link to="/addCandidate">Add Candidate</Link>
          </button>
        </div>
      </div>
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow className={style.tableHeader}>
                <TableCell>#</TableCell>
                <TableCell>
                  <div className={style.thead}>
                    <p>Cashback</p>
                    <span>
                      <IoIosArrowUp
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "cashBack" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc";
                          setSortConfig({
                            key: "cashBack",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "cashBack" &&
                            sortConfig.direction === "asc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                      <IoIosArrowDown
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "cashBack" &&
                            sortConfig.direction === "desc"
                              ? "asc"
                              : "desc";
                          setSortConfig({
                            key: "cashBack",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "cashBack" &&
                            sortConfig.direction === "desc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Rank</p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Full Name</p>
                    <span>
                      <IoIosArrowUp
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "firstName" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc";
                          setSortConfig({
                            key: "firstName",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "firstName" &&
                            sortConfig.direction === "asc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                      <IoIosArrowDown
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "firstName" &&
                            sortConfig.direction === "desc"
                              ? "asc"
                              : "desc";
                          setSortConfig({
                            key: "firstName",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "firstName" &&
                            sortConfig.direction === "desc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Reg. Date</p>
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

                <TableCell>
                  <div className={style.thead}>
                    <p>Phone number</p>
                    <span>
                      <IoIosArrowUp
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "phoneNumber" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc";
                          setSortConfig({
                            key: "phoneNumber",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "phoneNumber" &&
                            sortConfig.direction === "asc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                      <IoIosArrowDown
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "phoneNumber" &&
                            sortConfig.direction === "desc"
                              ? "asc"
                              : "desc";
                          setSortConfig({
                            key: "phoneNumber",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "phoneNumber" &&
                            sortConfig.direction === "desc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Msg</p>
                    <span>
                      <IoIosArrowUp
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "shouldReceive" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc";
                          setSortConfig({
                            key: "shouldReceive",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "shouldReceive" &&
                            sortConfig.direction === "asc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                      <IoIosArrowDown
                        onClick={() => {
                          const newDirection =
                            sortConfig.key === "shouldReceive" &&
                            sortConfig.direction === "desc"
                              ? "asc"
                              : "desc";
                          setSortConfig({
                            key: "shouldReceive",
                            direction: newDirection,
                          });
                        }}
                        style={{
                          color:
                            sortConfig.key === "shouldReceive" &&
                            sortConfig.direction === "desc"
                              ? "black"
                              : "#78829d",
                        }}
                      />
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Doc</p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Edit</p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className={style.thead}>
                    <p>Button</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.slice(0, rowsPerPage).map((data, i) => (
                <TableRow key={`${data.id}-${pageNumber}`}>
                  <TableCell>
                    <p className={style.listNum}>
                      {i + 1 + pageNumber * rowsPerPage}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className={style.cashbackbox}>$ {data.cashback}</p>
                  </TableCell>
                  <TableCell className={style.ranks}>
                    {rankStars[data.rank]
                      ? [...Array(5)].map((_, index) =>
                          index < rankStars[data.rank] ? (
                            <StarIcon
                              key={index}
                              style={{
                                color: "#F6B100",
                                marginLeft: "2px",
                              }}
                            />
                          ) : (
                            <EmptyStar
                              key={index}
                              style={{ marginLeft: "2px" }}
                            />
                          )
                        )
                      : [...Array(3)].map((_, index) => (
                          <span key={index} style={{ marginLeft: "2px" }}>
                            ❌
                          </span>
                        ))}
                  </TableCell>
                  <TableCell>
                    <p className={style.fullName}>
                      {data.firstName} {data.lastName}
                    </p>
                  </TableCell>
                  <TableCell>{data.createdAt}</TableCell>
                  <TableCell>
                    <p className={style.phoneNum}>{data.phoneNumber}</p>
                  </TableCell>
                  <TableCell>
                    <p className={style.recieveCheck}>
                      {data.shouldReceive ? "YES ✅" : "NO ❌"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className={style.docCount}>{data.countOrders}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Link to={`/candidateDetalis/${data.id}`}>
                        <InfoEdit />
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className={style.buttons}>
                    <button onClick={() => handleModal(data)}>
                      <RiRefreshLine className={style.uptadeIcon} /> Update
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>
                  <div className={style.paginationContainer}>
                    <div className={style.paginationControls}>
                      <span>Show</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) =>
                          setRowsPerPage(parseInt(e.target.value))
                        }
                        className={style.rowsPerPageSelect}
                      >
                        <option className={style.option} value={20}>
                          20
                        </option>
                        <option className={style.option} value={50}>
                          50
                        </option>
                        <option className={style.option} value={100}>
                          100
                        </option>
                      </select>
                      <span>per page</span>
                    </div>
                    <div className={style.leftPag}>
                      <div className={style.paginationInfo}>
                        {count > 0 && (
                          <span>
                            {Math.min(pageNumber * rowsPerPage + 1, count)}-
                            {Math.min((pageNumber + 1) * rowsPerPage, count)} of{" "}
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
                                Math.ceil(count / rowsPerPage) - 1
                              )
                            )
                          }
                          disabled={
                            pageNumber >= Math.ceil(count / rowsPerPage) - 1
                          }
                          className={
                            pageNumber >= Math.ceil(count / rowsPerPage) - 1
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
        )}
      </TableContainer>

      <ModalForm
        open={basicModal}
        onClose={toggleOpen}
        onSubmit={handleSubmit}
        firstName={firstName}
        lastName={lastName}
        phoneNumber={phoneNumber}
        shouldReceive={shouldReceive}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setPhoneNumber={setPhoneNumber}
        setShouldReceive={setShouldReceive}
        shouldReceives={shouldReceives}
      />
    </div>
  );
}

export default OrdersList;
