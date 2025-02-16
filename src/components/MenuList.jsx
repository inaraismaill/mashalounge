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
  Autocomplete,
} from "@mui/material";

import UpdateIcon from "@mui/icons-material/Update";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/Expenses/Supplier.module.css";
import { MenuService } from "../services/menuService";
import { MenuCategoryService } from "../services/menuCategoryService";
import { MenuImage } from "../services/menuImage";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { ItemExpenseService } from "../services/itemExpenseService";

const MenuList = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState("");
  const [datas, setDatas] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [itemExpenseOptions, setItemExpenseOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const menuService = new MenuService();
  const imageService = new MenuImage();
  const itemExpenseService = new ItemExpenseService();
  const [unit, setUnit] = useState([]);

  const foodDepartmentOptions = ["TEA", "BAR", "HOOKAH", "KITCHEN", "SET"];
  const values = {
    id: 0,
    name: "",
    price: 0,
    menuGroupId: 0,

    imageUrl: "",
    soldCount: 0,

    menuItems: [],
  };

  const [formValues, setFormValues] = useState(values);

  // const [menuItems, setMenuItems] = useState({
  //   name: "",
  //   foodDepartment: "",
  //   itemExpenseId: null,
  //   quantity: 0,
  // });

  const fetchItemExpenseOptions = async () => {
    itemExpenseService
      .getAll()
      .then((res) => {
        setItemExpenseOptions(
          res.data.data.map((item) => ({
            key: item.id,
            text: item.name,
            value: item.id,
          }))
        );
      })
      .catch((err) => alert(err.message));
  };

  const fetchCategoryOptions = async () => {
    try {
      const categoryService = new MenuCategoryService();
      const response = await categoryService.getAll();
      const options = response.data.data.map((item) => ({
        key: item.id,
        text: item.name,
        value: item.id,
      }));
      setCategoryOptions(options);
    } catch (error) {
      alert("Failed to fetch category options");
    }
  };

  useEffect(() => {
    fetchCategoryOptions();
    fetchItemExpenseOptions();
  }, []);

  const handleFileUpload = async () => {
    if (!imageFile) {
      alert("Please select a file to upload.");
      return;
    }

    const validationError = validateFile(imageFile);
    if (validationError) {
      alert(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("menuId", selectedMenu);

    try {
      const res = await imageService.saveImage(selectedMenu, formData);
      if (res.status === 200) {
        alert("Image uploaded successfully!");
        fetchData();
        setUploadModalOpen(false);
        setImageFile(null);
      }
    } catch (error) {
      alert("Image upload failed.");
    }
  };

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return "Please select a valid image file.";
    }
    if (file.size > 5000000) {
      return "File size exceeds 5MB limit.";
    }
    return null;
  };

  const handleIncrement = async (id) => {
    const confirmIncrement = window.confirm(
      "Are you sure you want to increase?"
    );
    if (!confirmIncrement) return;

    try {
      await menuService.increasingCount(id);
      fetchData();
    } catch (error) {
      alert("Error incrementing sold count:", error);
    }
  };

  const fetchData = useCallback(() => {
    menuService
      .getAll()
      .then((res) => {
        const sortedData = res.data.data.sort((a, b) => b.id - a.id);
        setDatas(sortedData);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const filteredData = datas.filter((item) =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { id, name, price, menuGroupId, menuItems } = formValues;

    const payload = {
      name: name || "",
      price: price || 0,
      menuGroupId: menuGroupId || null,
      menuItems: menuItems.map((item) => ({
        name: name || "",
        foodDepartment: item.foodDepartment || "",
        prepareTime:0,
        menuExpenseItems: (item.menuExpenseItems || []).map((expense) => ({
          itemExpenseId: expense.itemExpenseId || null,
          quantity: Number(expense.quantity) || 0,
        })),
      })),
    };
    console.log(payload);
    
    const saveOrUpdate =
      modalType === "add"
        ? menuService.save(payload)
        : menuService.update(id, payload);

    saveOrUpdate
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          alert("Successfully saved/updated");
          fetchData();
          setFormValues(values);
          setModalType("");
        }
      })
      .catch((e) => {
        const errorMessage =
          e.response?.data?.message || "An error occurred. Please try again.";
        alert(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleClickOpen = (type, item = {}) => {
    if (type === "update") {
      const units = item?.menuItems[0]?.menuExpenseItems?.map(
        (expenseItem) => expenseItem?.itemExpenseResponse?.unitName
      );
      setUnit(units || []);
    }

    setModalType(type);
    setFormValues({
      id: item?.id || 0,
      name: item?.name || "",
      price: item?.price || 0,
      menuGroupId: item?.menuGroup?.id || 0,
      imageUrl: item?.imageUrl || "",
      soldCount: item?.soldCount || 0,
      menuItems:
        item?.menuItems?.map((menuItem) => ({
          id: menuItem?.id || 0,
          name: menuItem?.name || "",
          foodDepartment: menuItem?.foodDepartment || "",
          menuExpenseItems:
            menuItem?.menuExpenseItems?.map((expenseItem) => ({
              itemExpenseId: expenseItem?.itemExpenseResponse?.id || null,
              quantity: expenseItem?.quantity || 0,
            })) || [],
        })) || [],
    });
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await menuService.delete(id);
      fetchData();
    } catch (error) {
      alert("Failed to delete item:", error);
    }
  };
  const handleNestedChange = (arrayKey, index, field, value) => {
    setFormValues((prevValues) => {
      const updatedArray = [...prevValues[arrayKey]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value,
      };
      return {
        ...prevValues,
        [arrayKey]: updatedArray,
      };
    });
  };
  const getItemData = (id, expenseIndex) => {
    if (id == null) return;
    const itemService = new ItemExpenseService();
    itemService
      .findById(id)
      .then((res) => {
        const data = res.data.data;
        setUnit((prevUnits) => {
          const updatedUnits = [...prevUnits];
          updatedUnits[expenseIndex] = data?.unitName || "";
          return updatedUnits;
        });
      })
      .catch((err) => alert(err.message));
  };

  const handleNestedExpenseChange = async (
    menuIndex,
    expenseIndex,
    field,
    value
  ) => {
    if (field === "itemExpenseId") {
      getItemData(value, expenseIndex);
    }

    setFormValues((prevValues) => {
      const updatedMenuItems = [...prevValues.menuItems];
      const updatedExpenseItems = [
        ...(updatedMenuItems[menuIndex].menuExpenseItems || []),
      ];
      updatedExpenseItems[expenseIndex] = {
        ...updatedExpenseItems[expenseIndex],
        [field]: value,
      };
      updatedMenuItems[menuIndex] = {
        ...updatedMenuItems[menuIndex],
        menuExpenseItems: updatedExpenseItems,
      };
      return {
        ...prevValues,
        menuItems: updatedMenuItems,
      };
    });
  };
  const addExpenseItem = (menuIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to add new item?"
    );
    if (!confirmDelete) return;

    setFormValues((prevValues) => {
      const updatedMenuItems = [...prevValues.menuItems];
      const newExpenseItem = {
        itemExpenseId: null,
        quantity: 0,
      };
      updatedMenuItems[menuIndex] = {
        ...updatedMenuItems[menuIndex],
        menuExpenseItems: [
          ...(updatedMenuItems[menuIndex]?.menuExpenseItems || []),
          newExpenseItem,
        ],
      };
      return {
        ...prevValues,
        menuItems: updatedMenuItems,
      };
    });
  };
  // const addMenuItem = () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to add new item?"
  //   );
  //   if (!confirmDelete) return;
  //   const newMenuItem = { ...menuItems, menuExpenseItems: [] };
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     menuItems: [...prevValues.menuItems, newMenuItem],
  //   }));

  //   setMenuItems({
  //     name: "",
  //     foodDepartment: "",
  //     itemExpenseId: null,
  //     quantity: 0,
  //   });
  // };

  const deleteExpenseItem = (menuIndex, expenseIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense item?"
    );
    if (!confirmDelete) return;
    setUnit((prevUnits) => {
      const updatedUnits = [...prevUnits];
      updatedUnits.splice(expenseIndex, 1);
      return updatedUnits;
    });
    setFormValues((prevValues) => {
      const updatedMenuItems = [...prevValues.menuItems];
      updatedMenuItems[menuIndex] = {
        ...updatedMenuItems[menuIndex],
        menuExpenseItems: updatedMenuItems[menuIndex].menuExpenseItems.filter(
          (_, i) => i !== expenseIndex
        ),
      };

      return {
        ...prevValues,
        menuItems: updatedMenuItems,
      };
    });
  };

  // const deleteMenuItem = (index) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this item?"
  //   );
  //   if (!confirmDelete) return;

  //   setFormValues((prevValues) => {
  //     const updatedMenuItems = prevValues.menuItems.filter(
  //       (_, i) => i !== index
  //     );
  //     return {
  //       ...prevValues,
  //       menuItems: updatedMenuItems,
  //     };
  //   });
  // };

  return (
    <>
      <div className={style.TableHeader}>
        <div>
          <h2>Menu</h2>
          <div style={{ gap: "20px", width: "30%" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              onClick={() => handleClickOpen("add")}
            >
              Add Menu
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
          <TableHead>
            <TableRow>
              {[
                "ID",
                "Image",
                "Name",
                "Menu Group",
                "Price",
                "Cost",
                "Sold Count",

                "Department",
                "Menu Item",
              ].map((head) => (
                <TableCell key={head} sx={{ textAlign: "center" }}>
                  {head}
                </TableCell>
              ))}
              <TableCell> Buttons</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData?.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt="Item"
                      width="60"
                      height="60"
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell>{data.name || ""}</TableCell>
                <TableCell>{data.menuGroup?.name || ""}</TableCell>
                <TableCell>{data.price || ""}</TableCell>
                <TableCell>{data.cost || ""}</TableCell>
                <TableCell>{data.soldCount || "0"}</TableCell>
                <TableCell>{data.menuItems[0]?.foodDepartment || ""}</TableCell>
                <TableCell>
                  {["Item name", "Price Per Unit", "Unit"].map((head, id) => (
                    <TableCell key={id}>{head}</TableCell>
                  ))}
                  {data?.menuItems?.length > 0
                    ? data.menuItems.map((menuItem) => (
                        <TableRow key={menuItem.id}>
                          <TableCell>
                            {menuItem.menuExpenseItems
                              .map((data) => data.itemExpenseResponse?.name)
                              .join(", ")}
                          </TableCell>
                          <TableCell>
                            {menuItem.menuExpenseItems
                              .map(
                                (data) => data.itemExpenseResponse?.pricePerUnit
                              )
                              .join(", ")}
                          </TableCell>
                          <TableCell>
                            {menuItem.menuExpenseItems
                              .map((data) => data.itemExpenseResponse?.unitName)
                              .join(", ")}
                          </TableCell>
                        </TableRow>
                      ))
                    : "No Menu Items"}
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Button
                      sx={{
                        minWidth: "24px",
                        height: "25px",
                        fontSize: "10px",
                        padding: "10px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(data.id);
                      }}
                    >
                      Sell Count
                    </Button>
                    <Button
                      sx={{
                        minWidth: "24px",
                        height: "25px",
                        fontSize: "8px",
                        padding: "10px",
                      }}
                      startIcon={<UpdateIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickOpen("update", data);
                      }}
                    />
                    <Button
                      sx={{
                        minWidth: "24px",
                        height: "25px",
                        fontSize: "8px",
                        padding: "10px 2px",
                      }}
                      startIcon={<ClearIcon />}
                      color="error"
                      onClick={() => handleDelete(data.id)}
                    />
                    <Button
                      sx={{
                        minWidth: "24px",
                        height: "25px",
                        fontSize: "8px",
                        padding: "10px",
                      }}
                      variant="contained"
                      onClick={() => {
                        setSelectedMenu(data.id);
                        setUploadModalOpen(true);
                      }}
                    >
                      <DriveFolderUploadIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={style.tfoot}>
            <TableRow>
              <TableCell colSpan={4}>
                <Pagination
                  count={Math.ceil(filteredData.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  shape="rounded"
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography variant="h6">Upload Image</Typography>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
          <Button onClick={handleFileUpload}>Upload</Button>
          <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
        </Box>
      </Modal>
      <Modal open={!!modalType} onClose={() => setModalType("")}>
        <Box sx={{ ...modalStyle, p: 2, maxHeight: "90vh", overflowY: "auto" }}>
          <Typography variant="h6">
            {modalType === "add" ? "Add New Item" : "Update Item"}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={formValues.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            value={formValues.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
            margin="normal"
          />
          <Autocomplete
            fullWidth
            disableClearable
            options={categoryOptions}
            getOptionLabel={(option) => option.text || ""}
            value={
              categoryOptions.find(
                (opt) => opt.value === formValues.menuGroupId
              ) || null
            }
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(event, newValue) =>
              handleChange("menuGroupId", newValue ? newValue.value : null)
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Group" margin="normal" />
            )}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Menu Items
          </Typography>
          {(formValues.menuItems?.length > 0
            ? formValues.menuItems
            : [{ name: "", foodDepartment: "", menuExpenseItems: [] }]
          ).map((item, index) => (
            <>
              <Box key={index} sx={{ border: "1px solid #ccc", p: 2, mb: 2 }}>
                {/* <TextField
        fullWidth
        label="Item Name"
        value={item.name || ""}
        onChange={(e) =>
          handleNestedChange("menuItems", index, "name", e.target.value)
        }
        margin="normal"
      /> */}
                <Autocomplete
                  fullWidth
                  options={foodDepartmentOptions}
                  getOptionLabel={(option) => option}
                  value={item.foodDepartment || ""}
                  onChange={(event, newValue) =>
                    handleNestedChange(
                      "menuItems",
                      index,
                      "foodDepartment",
                      newValue
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Food Department"
                      margin="normal"
                    />
                  )}
                />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Menu Expense Items
                </Typography>
                {item?.menuExpenseItems?.map((expense, expIndex) => (
                  <Box
                    key={expIndex}
                    sx={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      borderRadius: "8px",
                    }}
                  >
                    <Autocomplete
                      fullWidth
                      options={itemExpenseOptions}
                      getOptionLabel={(option) => option.text || ""}
                      value={
                        itemExpenseOptions.find(
                          (opt) => opt.value === expense.itemExpenseId
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleNestedExpenseChange(
                          index,
                          expIndex,
                          "itemExpenseId",
                          newValue ? newValue.value : null
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Item Expense"
                          margin="normal"
                        />
                      )}
                    />
                    <TextField
                      fullWidth
                      label="Quantity"
                      value={expense.quantity || ""}
                      onChange={(e) =>
                        handleNestedExpenseChange(
                          index,
                          expIndex,
                          "quantity",
                          e.target.value
                        )
                      }
                      margin="normal"
                    />
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
                      {unit[expIndex] || ""}
                    </div>
                    <Button
                      variant="outlined"
                      onClick={() => deleteExpenseItem(index, expIndex)}
                      color="secondary"
                      sx={{ mt: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => addExpenseItem(index)}
                  sx={{ mt: 1 }}
                >
                  Add Expense Item
                </Button>
              </Box>
              {/* <Button
      variant="outlined"
      onClick={() => deleteMenuItem(index)}
      color="secondary"
    >
      Delete
    </Button> */}
            </>
          ))}

          {/* <Button variant="outlined" sx={{ mx: 2 }} onClick={addMenuItem}>
            Add Menu Item
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {modalType === "add" ? "Add" : "Update"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default MenuList;

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
