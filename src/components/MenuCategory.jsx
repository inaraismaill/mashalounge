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
} from "@mui/material";

import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import style from "../styles/Expenses/Supplier.module.css";
import { MenuCategoryService } from "../services/menuCategoryService";
import { Modal } from "antd";

const Menucategory = () => {
  const categoryService = new MenuCategoryService();
  const [datas, setDatas] = useState({ content: [], totalPages: 1 });
  const [pageNumber, setPageNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [modalType, setModalType] = useState("");
  const [id, setId] = useState(null);

  const fetchData = (page) => {
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
  };
  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (name.trim() === "") return alert("Name cannot be empty!");
    setIsSubmitting(true);

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
      })
      .finally(() => setIsSubmitting(false));
  };
  const handleUpdate = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    if (name.trim() === "") return alert("Name cannot be empty!");

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
      .catch((er) => console.error("Update error:", er))
      .finally(() => setIsSubmitting(false));
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;
    try {
      await categoryService.delete(id);
      fetchData(pageNumber);
    } catch (error) {
      alert("Failed to delete item:", error);
    }
  };
  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Category</h2>
          <Button variant="contained" onClick={() => handleOpen("add")}>
            Add Category
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Buttons</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.content.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell>{i + 1 + 30 * pageNumber}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>
                  <div style={{ display: "flex" }}>
                    <Button
                      startIcon={<UpdateIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen("update", data);
                      }}
                    ></Button>
                    <Button
                      startIcon={<ClearIcon />}
                      color="error"
                      onClick={() => handleDelete(data.id)}
                    ></Button>
                  </div>
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

      <Modal
        open={!!modalType}
        onCancel={handleClose}
        title={modalType === "add" ? "Add New Category" : "Update Category"}
        footer={null}
      >
        <Box>
          <TextField
            fullWidth
            label="Name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={modalType === "add" ? handleSubmit : handleUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Menucategory;
