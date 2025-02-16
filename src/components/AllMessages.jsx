import React, { useEffect, useState } from "react";
import style from "../styles/AllMessages/AllMessages.module.css";
import { MessageService } from "../services/messagesService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableFooter,
} from "@mui/material";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import searchIcon from "../assets/svg/general.svg";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiRefreshLine } from "react-icons/ri";

const AllMessages = () => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    direction: "desc",
    key: "timestamp",
  });
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");

  const totalPages = Math.ceil(totalElements / rowsPerPage);

  const fetchMessages = async (searchQuery = "") => {
    try {
      const { key, direction } = sortConfig;

      const startDateToSend = startDateStr ? startDateStr : "";
      const endDateToSend = endDateStr ? endDateStr : "";

      const response = await new MessageService().getMessagesByPhoneNumber(
        searchQuery,
        page,
        rowsPerPage,
        direction || "",
        key || "",
        startDateToSend,
        endDateToSend
      );

      setMessages(response.data.data.content);
      setTotalElements(response.data.data.totalElements);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages(searchQuery);
  }, [page, rowsPerPage, sortConfig, searchQuery]);

  useEffect(() => {
    if (startDateStr) {
      fetchMessages(searchQuery);
    }
  }, [startDateStr, endDateStr]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setPage(0);
    fetchMessages("");
  };

  const handleSearchClick = () => {
    setSearchQuery(searchQuery);
    setPage(0);
  };

  const handleEndDateChange = (event) => {
    const selectedEndDate = event.target.value;
    setEndDateStr(selectedEndDate);

    if (startDateStr && selectedEndDate < startDateStr) {
      return;
    }

    if (startDateStr || selectedEndDate) {
      fetchMessages(searchQuery);
    }
  };

  const handleRefresh = async () => {
    try {
      await new MessageService().updateMessagesByPhoneNumber(searchQuery);
      fetchMessages(searchQuery);
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  };

  return (
    <Paper>
      <Box p={2}>
        <div className={style.TableHeader}>
          <h3>Messages</h3>
          <div>
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
          <div>
            <RiRefreshLine onClick={handleRefresh} />
            <div className={style.searchContainer}>
              <img
                className={style.searchIcon}
                src={searchIcon}
                alt="searchIcon"
                onClick={handleSearchClick}
              />
              <input
                type="text"
                placeholder="Search by Phone Number"
                onChange={handleSearchChange}
                value={searchQuery}
              />
              {searchQuery && (
                <AiOutlineClose
                  className={style.clearIcon}
                  onClick={handleClearSearch}
                />
              )}
            </div>
          </div>
        </div>
      </Box>
      <TableContainer className={style.allTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <div className={style.thead}>
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
              <TableCell>
                <div className={style.thead}>
                  <p>Message</p>
                  <span>
                    <IoIosArrowUp
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "message" &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc";
                        setSortConfig({
                          key: "message",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "message" &&
                          sortConfig.direction === "asc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                    <IoIosArrowDown
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "message" &&
                          sortConfig.direction === "desc"
                            ? "asc"
                            : "desc";
                        setSortConfig({
                          key: "message",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "message" &&
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
                  <p>Sent At</p>
                  <span>
                    <IoIosArrowUp
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "timestamp" &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc";
                        setSortConfig({
                          key: "timestamp",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "timestamp" &&
                          sortConfig.direction === "asc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                    <IoIosArrowDown
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "timestamp" &&
                          sortConfig.direction === "desc"
                            ? "asc"
                            : "desc";
                        setSortConfig({
                          key: "timestamp",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "timestamp" &&
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
                  <p>From Me</p>
                  <span>
                    <IoIosArrowUp
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "fromMe" &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc";
                        setSortConfig({
                          key: "fromMe",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "fromMe" &&
                          sortConfig.direction === "asc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                    <IoIosArrowDown
                      onClick={() => {
                        const newDirection =
                          sortConfig.key === "fromMe" &&
                          sortConfig.direction === "desc"
                            ? "asc"
                            : "desc";
                        setSortConfig({
                          key: "fromMe",
                          direction: newDirection,
                        });
                      }}
                      style={{
                        color:
                          sortConfig.key === "fromMe" &&
                          sortConfig.direction === "desc"
                            ? "black"
                            : "#78829d",
                      }}
                    />
                  </span>
                </div>
              </TableCell>
              <TableCell>Full Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <span
                    className={style.id}
                    onClick={() => setSearchQuery(message.phoneNumber)}
                  >
                    {message.id}
                  </span>
                </TableCell>
                <TableCell>
                  <div className={style.messageBox}>
                    <span
                      style={{ color: `${message.color}` }}
                      className={style.circle}
                    >
                      ●
                    </span>
                    <p style={{ borderLeft: `2px solid ${message.color}` }}>
                      {message.message}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{message.date}</span>
                  <br />
                  <span>{message.time}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      message.fromMe ? style.TruefromWho : style.FalsefromWho
                    }
                  >
                    {message.fromMe ? "Send" : "Receive"}
                  </span>
                </TableCell>
                <TableCell className={style.nameNumber}>
                  <span>{message.fullName}</span>
                  <p onClick={() => setSearchQuery(message.phoneNumber)}>
                    {message.phoneNumber}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <div className={style.paginationContainer}>
                  <div className={style.paginationControls}>
                    <span>Show</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
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
                      {totalElements > 0 && (
                        <span>
                          {Math.min(page * rowsPerPage + 1, totalElements)}-
                          {Math.min((page + 1) * rowsPerPage, totalElements)} of{" "}
                          {totalElements}
                        </span>
                      )}
                    </div>
                    <div className={style.pagination}>
                      <button
                        onClick={() => setPage(Math.max(page - 1, 0))}
                        disabled={page === 0}
                        className={
                          page === 0
                            ? `${style.arrowButton} ${style.disabledArrow}`
                            : `${style.arrowButton} ${style.activeArrow}`
                        }
                      >
                        <FaLongArrowAltLeft className={style.arrowIcon} />
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageIndex = Math.max(
                            0,
                            Math.min(totalPages - 1, page + i)
                          );
                          return (
                            <button
                              key={pageIndex}
                              className={
                                pageIndex === page
                                  ? style.activePage
                                  : style.pageButton
                              }
                              onClick={() => setPage(pageIndex)}
                            >
                              {pageIndex + 1}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          setPage(Math.min(page + 1, totalPages - 1))
                        }
                        disabled={page >= totalPages - 1}
                        className={
                          page >= totalPages - 1
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
      </TableContainer>
    </Paper>
  );
};

export default AllMessages;
