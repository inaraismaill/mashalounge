import { useEffect, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExpenseService } from "../services/expenseService";
import { ItemExpenseService } from "../services/itemExpenseService";
import { GroupExpenseService } from "../services/gruopExpenseService";
import { InnerGroupExpenseService } from "../services/innerGroupExpenseService";
import { SupplierService } from "../services/SupplierExpenseService";
import style from "../styles/Expenses/Supplier.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  TableFooter,
  Pagination,
  Modal,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { RxUpdate } from "react-icons/rx";

const Expense = () => {
  const expenseService = new ExpenseService();
  const [pageNumber, setPageNumber] = useState(0);
  const [modalType, setModalType] = useState("");
  const [datas, setDatas] = useState([]);

  const [unit, setUnit] = useState("");
  const [innerGroupExpense, setInnerGroupExpense] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const [formValues, setFormValues] = useState({
    id: 0,
    totalAmount: 0,
    quantity: 0,
    itemExpenseId: null,
    innerGroupExpenseId: null,
    groupExpenseId: null,
    supplierId: null,
    date: new Date().toISOString().slice(0, 19).replace(" ", "T"),
  });

  const fetchInnerGroupExpenseOptions = useCallback(() => {
    const innerGroupExpenseService = new InnerGroupExpenseService();

    innerGroupExpenseService
      .findAllByGroupId(formValues.groupExpenseId)
      .then((res) => {
        setInnerGroupExpense(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        );
      })
      .catch((err) => alert(err.message));
  }, [formValues.groupExpenseId]);

  const fetchItemOptions = useCallback(() => {
    const itemService = new ItemExpenseService();
    itemService
      .getAll()
      .then((res) => {
        setItemOptions(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        );
      })
      .catch((err) => alert(err.message));
  }, []);
  const getItemData = (id) => {
    const itemService = new ItemExpenseService();
    itemService
      .findById(id)
      .then((res) => {
        const data = res.data.data;

        setFormValues((prevValues) => ({
          ...prevValues,
          itemExpenseId: data.id,
          innerGroupExpenseId: data.innerGroupId,
          groupExpenseId: data.groupId,
          supplierId: data.supplierId,
        }));
        setUnit(data?.unitName);
      })
      .catch((err) => alert(err.message));
  };

  const fetchCategoryOptions = useCallback(() => {
    const categoryService = new GroupExpenseService();
    categoryService
      .getAll()
      .then((res) => {
        setCategoryOptions(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        );
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  const fetchSupplierOptions = useCallback(() => {
    const supplierService = new SupplierService();
    supplierService
      .getAll()
      .then((res) => {
        setSupplierOptions(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        );
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  const getOptions = useCallback(() => {
    fetchItemOptions();
    fetchCategoryOptions();
    fetchSupplierOptions();
  }, [fetchItemOptions, fetchCategoryOptions, fetchSupplierOptions]);

  useEffect(() => {
    if (formValues.groupExpenseId) {
      fetchInnerGroupExpenseOptions();
    }
  }, [fetchInnerGroupExpenseOptions, formValues.groupExpenseId]);

  const navigate = useNavigate();

  const fetchData = useCallback(
    (page) => {
      expenseService
        .findAllPaginate(page)
        .then((res) => {
          const sortedData = res.data.data.content.sort((a, b) => b.id - a.id);
          setDatas(sortedData);
        })
        .catch(() => navigate("/login"));
    },
    [navigate]
  );

  useEffect(() => {
    fetchData(pageNumber);
  }, [fetchData, pageNumber]);

  useEffect(() => {
    getOptions();
  }, [formValues.groupExpenseId, getOptions]);

  const handleClickOpen = (type, item = {}) => {
    setModalType(type);
    setFormValues({
      id: item.id,
      totalAmount: item.totalAmount || 0,
      quantity: item.quantity || 0,
      itemExpenseId: item.itemExpense?.id || null,
      innerGroupExpenseId: item.innerGroupExpense?.id || null,
      groupExpenseId: item.groupExpense?.id || null,
      supplierId: item.supplier?.id || null,
      date:
        item.date || new Date().toISOString().slice(0, 19).replace(" ", "T"),
    });
    
    setUnit(item?.itemExpense?.unitName || null);
    if (type === "update") {
      fetchCategoryOptions();

      if (formValues.groupExpenseId) {
        fetchInnerGroupExpenseOptions();
      }
    }
  };

  const handleSubmit = async () => {
    const {
      id,
      totalAmount,
      quantity,
      itemExpenseId,
      innerGroupExpenseId,
      groupExpenseId,
      supplierId,
      date,
    } = formValues;

    const payload = {
      totalAmount: totalAmount || 0,
      quantity: quantity || 0,
      itemExpenseId: parseInt(itemExpenseId) || null,
      innerGroupExpenseId: parseInt(innerGroupExpenseId) || null,
      groupExpenseId: parseInt(groupExpenseId) || null,
      supplierId: parseInt(supplierId) || null,
      date:
        date.replace(" ", "T") ||
        new Date().toISOString().slice(0, 19).replace(" ", "T"),
    };

    const saveOrUpdate =
      modalType === "add"
        ? expenseService.save(payload)
        : expenseService.update(id, payload);

    saveOrUpdate
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          alert("Successfully saved/updated");
          fetchData(pageNumber);
          setFormValues({
            id: 0,
            totalAmount: 0,
            quantity: 0,
            itemExpenseId: null,
            innerGroupExpenseId: null,
            groupExpenseId: null,
            supplierId: null,
            date: new Date().toISOString().slice(0, 19).replace(" ", "T"),
          });
          setModalType("");
        }
      })
      .catch((e) => {
        alert(e.response?.data?.message);
      });
  };

  const handleChange = (field, value) => {
    if (field === "itemExpenseId") {
      getItemData(value);
    } else {
      setFormValues((prev) => ({
        ...prev,
        [field]:
          field === "totalAmount" ||
          field === "quantity" ||
          field.endsWith("Id")
            ? parseInt(value)
            : value,
      }));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await expenseService.delete(id);
      fetchData(pageNumber);
    } catch (error) {
      alert("Failed to delete item:", error);
    }
  };

  const handleDateChange = (e) => {
    const value = new Date(e.target.value)
      .toISOString()
      .slice(0, 19)
      .replace(" ", "T");
    setFormValues((prev) => ({
      ...prev,
      date: value,
    }));
  };

  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Expenses</h2>
          <div>
            <Link to={"/expensesGroup"}>Category</Link>
            <span>{">"}</span>
            <Link to={"/allInnerGroupExpense"}>Subcategory</Link>
            <span>{">"}</span>
            <Link to={"/itemExpense"}>Item</Link>
            <span>{">"}</span>
            <Link to={"/SupplierExpense"}>Suppliers</Link>
          </div>
          <Button variant="contained" onClick={() => handleClickOpen("add")}>
            Add Expenses
          </Button>
        </div>
      </div>

      <TableContainer className={style.tableContainer}>
        <Table>
          <TableHead className={style.thead}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Sub Category Name</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas?.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell>{i + 1 + 30 * pageNumber}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.totalAmount}</TableCell>
                <TableCell>{data.itemExpense?.name || ""}</TableCell>
                <TableCell>{data.groupExpense?.name || ""}</TableCell>
                <TableCell>{data.innerGroupExpense?.name || ""}</TableCell>
                <TableCell>{data.supplier?.name || ""}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<RxUpdate />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen("update", data);
                    }}
                  >
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={style.tfoot}>
            <TableRow>
              <TableCell colSpan={4}>
                <Pagination
                  count={
                    datas.totalElements
                      ? Math.ceil(datas.totalElements / 50)
                      : 1
                  }
                  page={pageNumber + 1}
                  onChange={(event, value) => setPageNumber(value - 1)}
                  shape="rounded"
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Modal open={!!modalType} onClose={() => setModalType("")}>
        <Box sx={{ ...modalStyle, p: 2 }}>
          <Typography variant="h6">
            {modalType === "add" ? "Add New Item" : "Update Item"}
          </Typography>
          <TextField
            fullWidth
            label="Total Amount"
            value={formValues.totalAmount || ""}
            onChange={(e) => handleChange("totalAmount", e.target.value)}
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                value={formValues.quantity || ""}
                onChange={(e) => handleChange("quantity", e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={6}>
              <div
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "16.5px 14px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {unit || ""}
              </div>
            </Grid>
          </Grid>

          {[
            { field: "itemExpenseId", options: itemOptions },
            { field: "groupExpenseId", options: categoryOptions },
            { field: "innerGroupExpenseId", options: innerGroupExpense },
            { field: "supplierId", options: supplierOptions },
          ].map(({ field, options }) => (
            <TextField
              key={field}
              select
              fullWidth
              disabled={
                field === "innerGroupExpenseId" && !innerGroupExpense.length > 0
              }
              value={formValues[field]
              }
              onChange={(e) => handleChange(field, e.target.value)}
              SelectProps={{ native: true }}
              margin="normal"
            >
              <option value="">{`Select ${field
                .replace(/Id$/, "")
                .replace(/([A-Z])/g, " $1")
                .trim()}`}</option>
              {options.map((opt) => (
                <option key={opt.key} value={opt.value}>
                  {opt.text}
                </option>
              ))}
            </TextField>
          ))}
          <TextField
            fullWidth
            label="Date"
            value={
              formValues.date ||
              new Date().toISOString().slice(0, 19).replace(" ", "T")
            }
            onChange={handleDateChange}
            margin="normal"
            type="datetime-local"
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Expense;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};
