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
  Box,
  Autocomplete,
} from "@mui/material";

import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import { useCallback, useEffect, useState } from "react";
import style from "../styles/Expenses/Supplier.module.css";
import { Modal } from "antd";
import { TablesService } from "../services/tablesService";
import { RoomsService } from "../services/roomsService";

const Tables = () => {
  const tableService = new TablesService();
  const roomService = new RoomsService();
  const [datas, setDatas] = useState({ content: [], totalPages: 1 });
  const [pageNumber, setPageNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [modalType, setModalType] = useState("");
  const [formValues, setFormValues] = useState({
    id: 0,
    name: "",
    roomId: null,
  });

  const fetchData = (page) => {
    tableService
      .findAll(page)
      .then((res) => setDatas(res.data.data))
      .catch((er) => console.error("Fetch error:", er));
  };

  const fetchRoomOptions = useCallback(() => {
    roomService
      .getAll()
      .then((res) => {
        setRoomOptions(
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
    setFormValues({
      id: data.id || 0,
      name: data.name || "",
      roomId: data.roomId || null,
    });
  };

  const handleClose = () => {
    setModalType("");
    setFormValues({
      id: 0,
      name: "",
      roomId: null,
    });
  };

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (formValues.name.trim() === "") return alert("Name cannot be empty!");

    setIsSubmitting(true);

    const payload = {
      name: formValues.name,
      roomId: formValues.roomId,
    };

    const saveOrUpdate =
      modalType === "add"
        ? tableService.save(payload)
        : tableService.update(formValues.id, payload);

    saveOrUpdate
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          alert("Successfully saved/updated");
          fetchData(pageNumber);
          setFormValues({
            id: 0,
            name: "",
            roomId: null,
          });
          setModalType("");
        }
      })
      .catch((e) => {
        alert(e?.response?.data?.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await tableService.delete(id);
      fetchData(pageNumber);
    } catch (error) {
      alert("Failed to delete item:", error);
    }
  };

  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Tables</h2>
          <Button variant="contained" onClick={() => handleOpen("add")}>
            Add New Table
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Table Name</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.content.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell>{i + 1 + 10 * pageNumber}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.roomName || "No Room"}</TableCell>
                <TableCell>
                  <div style={{ display: "flex" }}>
                    <Button
                      startIcon={<UpdateIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen("update", data);
                      }}
                    />
                    <Button
                      startIcon={<ClearIcon />}
                      color="error"
                      onClick={() => handleDelete(data.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
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

      <Modal
        open={!!modalType}
        onCancel={handleClose}
        title={modalType === "add" ? "Add New Table" : "Update Table"}
        footer={null}
      >
        <Box>
          <TextField
            fullWidth
            label="Name"
            value={formValues.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            margin="normal"
          />
          <Autocomplete
            fullWidth
            disableClearable
            options={roomOptions}
            getOptionLabel={(option) => option.text || ""}
            value={
              roomOptions.find((opt) => opt.value === formValues.roomId) || null
            }
            onChange={(event, newValue) =>
              handleChange("roomId", newValue ? newValue.value : null)
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Room" margin="normal" />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Tables;
