import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  CircularProgress,
  Modal,
  Box,
  Pagination,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { EmployeeDetailService } from "../services/employeeDetailService";
import { PositionService } from "../services/PositionService";

const EmployeeDetails = () => {
  const employeeService = new EmployeeDetailService();
  const positionService = new PositionService();

  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [modalType, setModalType] = useState("");

  const initialFormValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    positionId: "",
    role: "",
    username: "",
    password: "",
    salary: "",
    startWorkDate: new Date().toISOString(),
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAll(pageNumber);
      setDatas(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await positionService.getAll();
      setRoles(response.data.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await employeeService.searchByName(searchTerm);
      setDatas(response.data.data);
    } catch (error) {
      console.error("Error searching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [pageNumber]);

  const handleOpen = (type, data = {}) => {
    setModalType(type);

    const matchedRole = roles.find((role) => role.name === data.position);

    if (type === "update") {
      setFormValues({
        id: data.id || 0,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        role: data.role || "",
        positionId: matchedRole ? matchedRole.id : "",
        username: data.username || "",
        password: data.password || "",
        salary: data.salary || "",
        startWorkDate: data.startWorkDate || new Date().toISOString(),
        endWorkDate: data.endWorkDate || new Date().toISOString(),
        working: data.working || true,
      });
    } else {
      setFormValues(initialFormValues);
    }
  };

  const handleFormChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      positionId,
      role,
      username,
      password,
      salary,
      startWorkDate,
      endWorkDate,
      working,
    } = formValues;

    const employeeData =
      modalType === "add"
        ? {
            firstName,
            lastName,
            phoneNumber,
            positionId,
            role,
            username,
            password,
            salary,
            startWorkDate,
          }
        : {
            id,
            firstName,
            lastName,
            phoneNumber,
            positionId,
            salary,
            startWorkDate,
            endWorkDate,
            working,
          };

    setLoading(true);
    try {
      if (modalType === "add") {
        await employeeService.saveEmployee(employeeData);
      } else if (modalType === "update") {
        await employeeService.updateEmployee(employeeData);
      }
      fetchEmployees();
      setModalType("");
      setFormValues(initialFormValues);
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    setLoading(true);

    try {
      await employeeService.deleteById(employeeId);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="TableHeader">
        <div>
          <h2>Employee Details</h2>

          <div style={{ gap: "20px", width: "30%" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={() => handleOpen("add")}
            >
              Add Employee
            </Button>
            <TextField
              label="Search by Name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleSearch}
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
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name Surname</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Start work date</TableCell>
              <TableCell>Buttons</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : datas.length > 0 ? (
              datas.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.salary}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.startWorkDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: "10px" }}
                      onClick={() => handleOpen("update", employee)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} style={{ textAlign: "center" }}>
                <Pagination
                  count={datas.length / 20}
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
        <Box
          sx={{
            width: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "20px",
            background: "#fff",
            margin: "100px auto",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <h3>{modalType === "add" ? "Add Employee" : "Update Employee"}</h3>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              mb: 2,
            }}
          >
            {[
              { label: "First Name", field: "firstName" },
              { label: "Last Name", field: "lastName" },
              { label: "Phone Number", field: "phoneNumber" },
              {
                label: "Positions",
                field: "positionId",
              },
              { label: "Username", field: "username" },
              {
                label: "Password",
                field: "password",
                type: showPassword ? "text" : "password",
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
              {
                label: "Salary",
                field: "salary",
                inputProps: {
                  inputMode: "decimal",
                  pattern: "[0-9]*\\.?[0-9]+",
                },
              },
              {
                label: "Start Work Date",
                field: "startWorkDate",
                type: "date",
                value: formValues.startWorkDate?.slice(0, 10),
              },
            ].map(({ label, field, ...props }) =>
              field === "positionId" ? (
                <Select
                  key="positionId"
                  value={formValues.positionId || ""}
                  onChange={(e) => {
                    const selectedRole = roles.find(
                      (role) => role.id === e.target.value
                    );
                    handleFormChange("positionId", e.target.value);
                    handleFormChange(
                      "role",
                      selectedRole ? selectedRole.name.toUpperCase() : ""
                    );
                  }}
                  displayEmpty
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select Position
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField
                  key={field}
                  label={label}
                  value={formValues[field] || ""}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  {...props}
                />
              )
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            {modalType === "add" ? "Add" : "Update"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default EmployeeDetails;
