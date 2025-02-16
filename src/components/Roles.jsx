import { useEffect, useState, useCallback, useMemo } from "react";
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
  CircularProgress,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import { Modal } from "antd";
import { PositionService } from "../services/PositionService";
import style from "../styles/Expenses/Supplier.module.css";

const Roles = () => {
  const positionService = new PositionService();

  const [roles, setRoles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalData, setModalData] = useState({ type: null, role: {} });

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await positionService.getAll();
      setRoles(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to fetch roles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openModal = (type, role = {}) => {
    setModalData({ type, role });
  };

  const closeModal = () => {
    setModalData({ type: null, role: {} });
  };

  const handleSubmit = async () => {
    const { type, role } = modalData;
    if (isSubmitting || !role.name.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === "add") {
        await positionService.save({ name: role.name });
      } else if (type === "update") {
        await positionService.update(role.id, { name: role.name });
      }
      closeModal();
      fetchRoles();
    } catch (error) {
      console.error("Error saving/updating role:", error);
      alert("Failed to save or update role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTableRows = useMemo(() => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (roles.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} align="center">
            No roles found.
          </TableCell>
        </TableRow>
      );
    }

    return roles.map((role, index) => (
      <TableRow key={role.id}>
        <TableCell>{index + 1 + 30 * pageNumber}</TableCell>
        <TableCell>{role.name}</TableCell>
        <TableCell>{role.employeeCount}</TableCell>
        <TableCell>
          <Button
            startIcon={<UpdateIcon />}
            onClick={() => openModal("update", role)}
          >
            Update
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [roles, isLoading, pageNumber]);

  return (
    <div>
      <div className={style.TableHeader}>
        <h2>Roles</h2>
        <Button variant="contained" onClick={() => openModal("add")}>
          Add Role
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Employee Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows}</TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <Pagination
                  count={totalPages}
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
        open={!!modalData.type}
        onCancel={closeModal}
        title={modalData.type === "add" ? "Add Role" : "Update Role"}
        footer={null}
      >
        <Box>
          <TextField
            fullWidth
            label="Name"
            value={modalData.role.name || ""}
            onChange={(e) =>
              setModalData((prev) => ({
                ...prev,
                role: { ...prev.role, name: e.target.value },
              }))
            }
            margin="normal"
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
    </div>
  );
};

export default Roles;