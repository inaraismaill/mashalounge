import { useEffect, useState } from "react";
import { InnerGroupExpenseService } from "../services/innerGroupExpenseService";
import style from "../styles/Expenses/AllCategoryExpenses.module.css";
import { Link } from "react-router-dom";
import { GroupExpenseService } from "../services/gruopExpenseService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  TableRow,
  DialogTitle,
  Pagination,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TableFooter,
  Select,
} from "@mui/material";
import { RiRefreshLine } from "react-icons/ri";

const AllInnerGroupExpense = () => {
  const [datas, setDatas] = useState({ content: []});
  const [id, setId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    groupExpenseId: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const fetchData = () => {
    const innerGroupExpenseService = new InnerGroupExpenseService();
    innerGroupExpenseService
      .findAll(pageNumber)
      .then((res) => setDatas(res.data.data))
      .catch((e) => console.error("Error fetching data:", e));
  };

  const getOptions = () => {
    const groupExpenseService = new GroupExpenseService();
    groupExpenseService
      .getAll()
      .then((res) => {
        const formattedOptions = res.data.data.map((item) => ({
          key: item.id,
          text: item.name,
          value: item.id,
        }));
        setOptions(formattedOptions);
      })
      .catch(() => {
        // console.error("Fetch options error:", e);
        setOptions([]);
      });
  };

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pageNumber]);
  
  const handleClickOpen = (item = { name: "", groupExpenseId: null }) => {
    setEditData(item);
    setId(item.id || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData({ name: "", groupExpenseId: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: name === "groupExpenseId" ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    if (!editData.name || !editData.groupExpenseId) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const payload = {
      name: editData.name,
      groupExpenseId: editData.groupExpenseId,
    };

    const innerGroupExpenseService = new InnerGroupExpenseService();
    innerGroupExpenseService
      .save(payload)
      .then((res) => {
        if (res.status === 200) {
          fetchData();
        }
      })
      .catch((e) => console.error("Save error:", e));

    handleClose();
  };

  const handleUpdate = () => {
    if (!editData.name || !editData.groupExpenseId) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const payload = {
      name: editData.name,
      groupExpenseId: editData.groupExpenseId,
    };

    const innerGroupExpenseService = new InnerGroupExpenseService();
    innerGroupExpenseService
      .update(id, payload)
      .then((res) => {
        if (res.status === 200) {
          fetchData();
        }
      })
      .catch((e) => console.error("Update error:", e));

    handleClose();
  };
  const filteredData = datas.content.filter((item) =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );
  return (
    <div>
      <div className={style.TableHeader}>
        <div>
          <h2>Subcategory</h2>
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
          <div style={{ gap: "20px", width: "40%" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={() => handleClickOpen()}>Subcategory Add
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

      <TableContainer>
        <Table>
          <TableHead className={style.thead}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Group name</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={style.tbody}>
            {filteredData?.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell>
                  <span>{i + 1 + 50 * pageNumber}</span>
                </TableCell>
                <TableCell>{data?.name}</TableCell>
                <TableCell>{data?.groupName || ""}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(data);
                    }}
                  >
                    <RiRefreshLine /> <span>Update</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={style.tfoot}>
            <TableRow>
              <TableCell colSpan={4}>
                <Pagination
                  count={datas.totalPages || 1}
                  page={pageNumber + 1}
                  onChange={(event, value) => setPageNumber(value - 1)}
                  shape="rounded"
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{id ? "Update" : "Add new"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="İsim"
            type="text"
            fullWidth
            value={editData.name}
            onChange={handleChange}
          />
          {options.length > 0 && (
            <Select
              fullWidth
              name="groupExpenseId"
              value={editData.groupExpenseId || ""}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {options.map((category) => (
                <MenuItem key={category.key} value={category.value}>
                  {category.text}
                </MenuItem>
              ))}
            </Select>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={id ? handleUpdate : handleAdd} color="primary">
            {id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllInnerGroupExpense;
