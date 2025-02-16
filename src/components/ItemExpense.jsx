import { useCallback, useEffect, useMemo, useState } from "react";
import { ItemExpenseService } from "../services/itemExpenseService";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TableFooter,
  CircularProgress,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import style from "../styles/Expenses/ItemExpenses.module.css";
import { GroupExpenseService } from "../services/gruopExpenseService";
import { SupplierService } from "../services/SupplierExpenseService";
import { InnerGroupExpenseService } from "../services/innerGroupExpenseService";
import { UnitService } from "../services/unitService";

const ItemExpense = () => {
  const [datas, setDatas] = useState({ content: [], totalPages: 1 });
  const [pageNumber, setPageNumber] = useState(0);
  const [modalType, setModalType] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [suppliler, setSuppliler] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [innerGroupExpense, setInnerGroupExpense] = useState([]);
  const [formValues, setFormValues] = useState({
    id: 0,
    name: "",
    uniteId: null,
    groupExpenseId: null,
    innerGroupExpenseId: null,
    supplierId: null,
    pricePerUnit: null,
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchData = useCallback(
    (page) => {
      setLoading(true);
      const itemExpenseService = new ItemExpenseService();
      itemExpenseService
        .findAllPaginate(page)
        .then((res) => {
          const sortedContent = res.data.data.content.sort(
            (a, b) => b.id - a.id
          );
          setDatas({ ...res.data.data, content: sortedContent });
        })
        .catch(() => navigate("/login"))
        .finally(() => setLoading(false));
    },
    [navigate]
  );

  useEffect(() => {
    fetchData(pageNumber);
  }, [fetchData, pageNumber]);

  const getOptions = useCallback(() => {
    setLoading(true);
    const categoryService = new GroupExpenseService();
    const supplierService = new SupplierService();
    const unitService = new UnitService();

    unitService
      .getAll()
      .then((res) => {
        setUnitOptions(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        );
      })
      .catch((err) => alert(err.message));

    categoryService
      .getAll()
      .then((res) =>
        setCategorys(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        )
      )
      .catch(console.error);

    supplierService
      .getAll()
      .then((res) =>
        setSuppliler(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchSupplierOptions = () => {
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
  };

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  useEffect(() => {
    if (formValues.groupExpenseId) {
      fetchSupplierOptions();
    }
  }, [formValues.groupExpenseId]);

  const handleOpen = (type, data = {}) => {
    setModalType(type);
    setFormValues({
      id: data.id || 0,
      name: data.name || "",
      uniteId: data.unitId || null,
      groupExpenseId: data.groupId || "",
      innerGroupExpenseId: data.innerGroupId || "",
      supplierId: data.supplierId || null,
      pricePerUnit: data.pricePerUnit || null,
    });
  };

  const handleSubmit = () => {
    const {
      id,
      name,
      uniteId,
      groupExpenseId,
      supplierId,
      innerGroupExpenseId,
      pricePerUnit,
    } = formValues;
    
    if (!name || !uniteId || !groupExpenseId || !supplierId || !pricePerUnit) {
      alert("Please fill in all fields.");
      return;
    }
    const itemExpenseService = new ItemExpenseService();
    const payload = {
      name,
      uniteId,
      groupExpenseId,
      innerGroupExpenseId,
      supplierId,
      pricePerUnit,
    };

    const saveOrUpdate =
      modalType === "add"
        ? itemExpenseService.save(payload)
        : itemExpenseService.update(id, payload);

    saveOrUpdate
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          alert("Successfully saved/updated");
          setFormValues({
            id: 0,
            name: "",
            uniteId: null,
            groupExpenseId: null,
            supplierId: null,
            innerGroupExpenseId: null,
            pricePerUnit: null,
          });
          setModalType("");
          fetchData(pageNumber);
        }
      })
      .catch(() => {
        alert("An error occurred. Please try again.");
      });
  };

  const handleFormChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "groupExpenseId" ? { innerGroupExpenseId: null } : {}),
    }));
  };

  const modalStyle = useMemo(
    () => ({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 1,
    }),
    []
  );
  const filteredData = datas.content.filter((item) =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );
  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Item</h2>
          <div>
            <Link to={"/expensesGroup"}>Category</Link>
            <span>{">"}</span>
            <Link to={"/allInnerGroupExpense"}>Subcategory</Link>
            <span>{">"}</span>
            <Link to={"/itemExpense"}>Item</Link>
            <span>{">"}</span>
            <Link to={"/SupplierExpense"}>Suppliers</Link>
          </div>

          <div style={{ gap: "20px", width: "30%" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={() => handleOpen("add")}
            >
              Add Item
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
              <TableCell>Unite</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Sub Category Name</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Price Per Unit</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>

          <TableBody className={style.tbody}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredData?.length > 0 ? (
              filteredData.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{data?.name || ""}</TableCell>
                  <TableCell>{data?.unitName || ""}</TableCell>
                  <TableCell>{data?.groupName || ""}</TableCell>
                  <TableCell>{data.innerGroupName || ""}</TableCell>
                  <TableCell>{data?.supplierName || ""}</TableCell>
                  <TableCell>{data?.pricePerUnit || ""}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen("update", data);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: "center" }}>
                <Pagination
                  count={
                    datas.totalPages > 1 &&
                    filteredData.length <= datas.content.length
                      ? datas.totalPages
                      : 1
                  }
                  page={pageNumber + 1}
                  onChange={(event, value) => setPageNumber(value - 1)}
                  shape="rounded"
                  sx={{ mt: 2 }}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Modal open={!!modalType} onClose={() => setModalType("")}>
        <Box sx={{ ...modalStyle, p: 2 }}>
          <h3>{modalType === "add" ? "Add Item" : "Update Item"}</h3>

          <TextField
            label="Name"
            value={formValues.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            fullWidth
          />
          <Autocomplete
            fullWidth
            disableClearable
            options={unitOptions}
            getOptionLabel={(option) => option.text || ""}
            value={
              unitOptions.find((opt) => opt.value === formValues.uniteId) ||
              null
            }
            onChange={(event, newValue) =>
              handleFormChange("uniteId", newValue ? newValue.value : "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select unit Expense"
                margin="normal"
              />
            )}
          />

          <TextField
            label="Category"
            select
            value={formValues.groupExpenseId || ""}
            onChange={(e) => handleFormChange("groupExpenseId", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {categorys.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.text}
              </MenuItem>
            ))}
          </TextField>

          {formValues.groupExpenseId && innerGroupExpense.length > 0 && (
            <TextField
              label="Subcategory"
              select
              value={formValues.innerGroupExpenseId || ""}
              onChange={(e) =>
                handleFormChange("innerGroupExpenseId", e.target.value)
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              {innerGroupExpense.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Supplier"
            select
            value={formValues.supplierId || ""}
            onChange={(e) => handleFormChange("supplierId", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {suppliler.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.text}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Price Per Unit"
            value={formValues.pricePerUnit}
            onChange={(e) => handleFormChange("pricePerUnit", e.target.value)}
            fullWidth
            inputProps={{
              inputMode: "decimal",
              pattern: "[0-9]*\\.?[0-9]+",
            }}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {modalType === "add" ? "Add" : "Update"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ItemExpense;
