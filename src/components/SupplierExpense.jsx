import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Button,
  Modal,
  TextField,
  Box,
} from "@mui/material";
import style from "../styles/Expenses/Supplier.module.css";
import { SupplierService } from "../services/SupplierExpenseService";
import { RxUpdate } from "react-icons/rx";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #4b5675",
  boxShadow: 24,
  p: 4,
};

const SupplierExpense = () => {
  const [datas, setDatas] = useState({
    content: [],
    totalPages: 1,
    size: 30,
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phoneNumber: "",
    note: "",
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const supplierService = new SupplierService();

  useEffect(() => {
    fetchSuppliers();
  }, [pageNumber]);

  const fetchSuppliers = () => {
    supplierService
      .getAllPaginate(pageNumber)
      .then((response) => {
        setDatas(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching supplier data:", error);
      });
  };

  const handleOpen = (supplier = null) => {
    setSelectedSupplier(supplier);
    setNewSupplier(supplier || { name: "", phoneNumber: "", note: "" });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSaveSupplier = () => {
    const phoneRegex = /^\+994\d{9}$/;
    if (!phoneRegex.test(newSupplier.phoneNumber)) {
      alert("Please enter a valid phone number (eg: +994001231212)");
      return;
    }
    if (!newSupplier.name) {
      alert("Please fill in the name field.");
      return;
    }

    const saveOperation = selectedSupplier
      ? supplierService.update(selectedSupplier.id, newSupplier)
      : supplierService.createSupplier(newSupplier);

    saveOperation
      .then(() => {
        fetchSuppliers();
        handleClose();
      })
      .catch((error) => console.error("Error saving supplier:", error));

    setNewSupplier({ name: "", phoneNumber: "", note: "" });
  };
  const filteredData = datas.content.filter((item) =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Suppliers</h2>
          <div style={{ gap: "20px", width: "30%" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={() => handleOpen()}
            >
              Add Supplier
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
              <TableCell>Phone Number</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={style.tbody}>
            {filteredData.length > 0 ? (
              filteredData.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <span>{i + 1 + datas.size * pageNumber}</span>
                  </TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.phoneNumber}</TableCell>
                  <TableCell>{data.note}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<RxUpdate />}
                      onClick={() => handleOpen(data)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No suppliers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className={style.tfoot}>
          <Pagination
            count={datas.totalPages || 1}
            page={pageNumber + 1}
            onChange={(event, value) => setPageNumber(value - 1)}
            shape="rounded"
          />
        </div>
      </TableContainer>

      <Modal className={style.modal} open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>{selectedSupplier ? "Edit Supplier" : "Add New Supplier"}</h2>
          <TextField
            fullWidth
            label="Name"
            value={newSupplier.name}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={newSupplier.phoneNumber}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, phoneNumber: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Note"
            value={newSupplier.note}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, note: e.target.value })
            }
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSupplier}
            sx={{ mt: 2 }}
          >
            {selectedSupplier ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SupplierExpense;
