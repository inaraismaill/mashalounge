import React, { useEffect, useState } from "react";
import { OrderService } from "../services/orderService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Box,
  Pagination,
  Link as MuiLink,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import style from "../styles/ListDocs/Documents.module.css";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "../assets/svg/StarIcon";
import EmptyStar from "../assets/svg/EmptyStar";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const SearchOrders = () => {
  const [datas, setDatas] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [docNumber, setDocNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState("IGNORED");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const orderService = new OrderService();
      try {
        const res = await orderService.findByDocNumberContains(
          pageNumber,
          docNumber,
          candidateFilter,
          rowsPerPage
        );
        setDatas(res.data.data);
        setCount(res.data.totalCount);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNumber, docNumber, candidateFilter, rowsPerPage]);

  const handleFilterChange = (event) => {
    setCandidateFilter(event.target.checked ? "RETURNED" : "NEW");
    setPageNumber(0);
  };

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

  const rankStars = {
    Leytenant: 1,
    Kapitan: 2,
    Mayor: 3,
    Polkovnik: 4,
    General: 5,
  };

  return (
    <div className={style.fullTab}>
      <div className={style.titleHead}>
        <h3>Orders</h3>
        <div>
          <div className={style.searchInput}>
            <SearchIcon />
            <input
              type="text"
              onChange={(e) => {
                setDocNumber(e.target.value);
                setPageNumber(0);
              }}
              placeholder="Find by Doc Number"
            />
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={candidateFilter === "RETURNED"}
                onChange={handleFilterChange}
              />
            }
            label="Returned"
          />
        </div>
      </div>
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className={style.forscroll}>
              <Table className={style.table}>
                <TableHead className={style.TableHeader}>
                  <TableRow className={style.tableRow}>
                    <TableCell>#</TableCell>
                    <TableCell>Doc</TableCell>
                    <TableCell>Table</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date and Time</TableCell>
                    <TableCell>Candidate Name</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell title="Employee Name">E.N.</TableCell>
                    <TableCell>Rank</TableCell>
                    <TableCell>Duration Time</TableCell>
                    <TableCell>Customer Type</TableCell>
                    <TableCell title="Count Candidate">C.C.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={style.TableBody}>
                  {datas?.content?.map((data, i) => (
                    <TableRow key={data.id}>
                      <TableCell>
                        <p className={style.listNum}>
                          {pageNumber * 100 + i + 1}
                        </p>
                      </TableCell>
                      <TableCell>
                        <MuiLink
                          component={Link}
                          to={"/candidateItms/" + data.id}
                          sx={{ color: "#ffff", textDecoration: "none" }}
                        >
                          <p
                            style={{ background: `${data.docNumberColor}` }}
                            className={style.docNum}
                          >
                            {data.docNumber}
                          </p>
                        </MuiLink>
                      </TableCell>
                      <TableCell>
                        {data.hallName} - {data.table}
                      </TableCell>
                      <TableCell>
                        <p className={style.amount}>{data.amount}</p>
                      </TableCell>
                      <TableCell className={style.datetime}>
                        {data.date} <br /> {data.time}
                      </TableCell>
                      <TableCell>
                        {data.candidateName === "No candidate"
                          ? [...Array(3)].map((_, index) => (
                              <span key={index} style={{ marginLeft: "2px" }}>
                                ❌
                              </span>
                            ))
                          : data.candidateName}
                      </TableCell>

                      <TableCell className={style.branch}>
                        {data.foodDepartments &&
                        data.foodDepartments.length > 0 ? (
                          data.foodDepartments.map((food, index) => {
                            const firstLetter = food.name.charAt(0);
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
                                {food.name}
                              </p>
                            );
                          })
                        ) : (
                          <p></p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p
                          title={data.employeeName}
                          className={style.employeeName}
                        >
                          {data.employeeShortName}
                        </p>
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

                      <TableCell>{data.durationTime}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                        }}
                      >
                        <p
                          className={`${style.costumerType} ${
                            data.customerType === "RETURNED"
                              ? style.returned
                              : data.customerType === "IGNORED"
                              ? style.ignored
                              : data.customerType === "NEW"
                              ? style.new
                              : ""
                          }`}
                        >
                          {data.customerType}
                        </p>
                      </TableCell>
                      <TableCell>
                        {data.countCandidateOrders === 0 ? (
                          <span>❌</span>
                        ) : (
                          data.countCandidateOrders
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
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
                                {Math.min(
                                  (pageNumber + 1) * rowsPerPage,
                                  count
                                )}{" "}
                                of {count}
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
                                length: Math.min(
                                  5,
                                  Math.ceil(count / rowsPerPage)
                                ),
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
                              <FaLongArrowAltRight
                                className={style.arrowIcon}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
              <Pagination
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
                count={Math.ceil(datas?.totalElements / 100)}
                page={pageNumber + 1}
                onChange={(e, value) => setPageNumber(value - 1)}
                color="primary"
              />
            </div>
          </>
        )}
      </Box>
    </div>
  );
};

export default SearchOrders;
