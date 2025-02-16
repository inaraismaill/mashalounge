import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GroupExpenseService } from "../services/gruopExpenseService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Modal,
  Box,
  Typography,
  TableFooter,
  Pagination,
} from "@mui/material";
import { RxUpdate } from "react-icons/rx";

import style from "../styles/Expenses/Supplier.module.css";

const GroupExpense = () => {
  const [datas, setDatas] = useState({ content: [], totalPages: 1 });
  const [pageNumber, setPageNumber] = useState(0);
  const [name, setName] = useState("");
  const [modalType, setModalType] = useState("");
  const [id, setId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = (page) => {
    const categoryService = new GroupExpenseService();
    categoryService
      .findAll(page)
      .then((res) => {
        setDatas(res.data.data);
      })
      .catch((er) => console.error("Fetch error:", er));
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  const handleOpen = (type, data = {}) => {
    setModalType(type);
    if (type === "update") {
      setId(data.id);
      setName(data.name);
    } else {
      setId(null);
      setName("");
    }
  };

  const handleClose = () => {
    setModalType("");
    setName("");
    setIsSubmitting(false);
  };
  const handleSubmit = () => {
    if (name.trim() === "") return alert("Name cannot be empty!");

    if (isSubmitting) return;
    setIsSubmitting(true);
    const categoryService = new GroupExpenseService();
    const data = { name };

    categoryService
      .save(data)
      .then((res) => {
        if (res.status === 200) {
          fetchData(pageNumber);
          setName("");
          handleClose();
        }
      })
      .catch((err) => {
        alert(err.message);
        setIsSubmitting(false);
      });
  };
  const handleUpdate = () => {
    if (name.trim() === "") return alert("Name cannot be empty!");

    if (isSubmitting) return;
    setIsSubmitting(true);
    const categoryService = new GroupExpenseService();
    categoryService
      .update(id, { name })
      .then((res) => {
        if (res.status === 200) {
          setDatas((prev) => ({
            ...prev,
            content: prev.content.map((item) =>
              item.id === id ? { ...item, name } : item
            ),
          }));
          handleClose();
        }
      })
      .catch((err) => {
        alert(err.message);
        setIsSubmitting(false);
      });
  };

  const filteredData = datas.content.filter((item) =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Category</h2>
          <div>
            <Link to={"/expensesGroup"}>
              <span>Category</span>
            </Link>
            <span>{">"}</span>
            <Link to={"/allInnerGroupExpense"}>
              <span>Subcategory</span>
            </Link>
            <span>{">"}</span>
            <Link to={"/itemExpense"}>
              <span>Item</span>
            </Link>
            <span>{">"}</span>
            <Link to={"/SupplierExpense"}>
              <span>Suppliers</span>
            </Link>
          </div>

          <div style={{ gap: "20px", width: "30%" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={() => handleOpen("add")}
            >
              Add Category
            </Button>

            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "30px",
                },
              }}
            />
          </div>
        </div>
      </div>

      <TableContainer className={style.tableContainer}>
        <Table>
          <TableHead className={style.thead}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={style.tbody}>
            {filteredData?.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{data?.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<RxUpdate />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen("update", data);
                    }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <div className={style.tfoot}>
              <Pagination
                count={datas.totalPages || 1}
                page={pageNumber + 1}
                onChange={(event, value) => setPageNumber(value - 1)}
                shape="rounded"
                sx={{ mt: 2 }}
              />
            </div>
          </TableFooter>
        </Table>
      </TableContainer>

      <Modal open={modalType === "add"} onClose={handleClose}>
        <Box sx={{ ...modalStyle, p: 2 }}>
          <Typography variant="h6">Add New Item</Typography>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      <Modal open={modalType === "update"} onClose={handleClose}>
        <Box sx={{ ...modalStyle, p: 2 }}>
          <Typography variant="h6">Update Item</Typography>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default GroupExpense;

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
