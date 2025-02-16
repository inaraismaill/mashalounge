import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TableFooter,
  Pagination,
  TextField,
  Autocomplete,
} from "@mui/material";

import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import { useCallback, useEffect, useState } from "react";
import style from "../styles/Expenses/Supplier.module.css";
import { Modal } from "antd";
import { StorageService } from "../services/storageServer";
import { ItemExpenseService } from "../services/itemExpenseService";

const Storage = () => {
  const itemService = new ItemExpenseService();
  const storageService = new StorageService();
  const [datas, setDatas] = useState({ content: [], totalPages: 1 });
  const [pageNumber, setPageNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemOptions, setItemOptions] = useState([]);
  const [quantity, setQuantity] = useState(null);
  const [modalType, setModalType] = useState("");
  const [currentId, setCurrentId] = useState(null);

  const fetchData = (page) => {
    storageService
      .getAllPaginate(page)
      .then((res) => {
        setDatas(res.data.data);
      })
      .catch((er) => console.error("Fetch error:", er));
  };

  const fetchRoomOptions = useCallback(() => {
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
      .catch((er) => console.error("Fetch error:", er));
  }, []);

  useEffect(() => {
    fetchRoomOptions();
  }, [fetchRoomOptions]);
  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  const handleOpen = (type, data = {}) => {
    setModalType(type);
    setQuantity(data.quantity || null);
    if (type === "add") {
      setCurrentId(data.id || null);
    }
  };

  const handleClose = () => {
    setModalType(null);
    setQuantity("");
    setCurrentId(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!quantity || quantity <= 0 || !currentId) {
      return alert("Please ensure all fields are correctly filled!");
    }

    setIsSubmitting(true);

    const data = {
      quantity,
      itemExpenseId: currentId,
    };

    storageService
      .save(data)
      .then((res) => {
        if (res.status === 200) {
          fetchData(pageNumber);
          handleClose();
        }
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleUpdate = async () => {
    if (isSubmitting || !currentId || quantity <= 0) {
      return alert("Please ensure all fields are correctly filled!");
    }
    setIsSubmitting(true);
    const data = {
      quantity,
    };
    storageService
      .update(currentId, data)
      .then((res) => {
        if (res.status === 200) {
          alert("Successfully updated");
          fetchData(pageNumber);
          handleClose();
        }
      })
      .catch((er) => console.error("Update error:", er))
      .finally(() => setIsSubmitting(false));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;
    try {
      await storageService.delete(id);
      fetchData(pageNumber);
    } catch (error) {
      alert("Failed to delete item:", error);
    }
  };

  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Storage</h2>
          
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Inner Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.content.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.itemExpense?.name}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.totalAmount}</TableCell>
                <TableCell>{data.itemExpense?.groupName}</TableCell>
                <TableCell>{data.itemExpense?.innerGroupName}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      handleOpen("update", data);
                      setCurrentId(data.id);
                    }}
                    startIcon={<UpdateIcon />}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDelete(data.id)}
                    startIcon={<ClearIcon />}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={style.tfoot}>
            <TableRow>
              <TableCell colSpan={5}>
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

      <Modal
        open={!!modalType}
        onCancel={handleClose}
        title={modalType === "add" ? "Add" : "Update"}
        footer={null}
      >
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity || 0}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          margin="normal"
        />
        {modalType == "add" ? (
          <Autocomplete
            fullWidth
            disableClearable
            options={itemOptions}
            getOptionLabel={(option) => option.text || ""}
            value={itemOptions.find((opt) => opt.value === currentId) || null}
            onChange={(event, newValue) => setCurrentId(newValue.value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Item" margin="normal" />
            )}
          />
        ) : (
          ""
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={modalType === "add" ? handleSubmit : handleUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Modal>
    </>
  );
};

export default Storage;