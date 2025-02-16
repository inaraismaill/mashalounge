import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
} from "@mui/material";
import { MenuService } from "../services/menuService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { addOrderItem } from "../app/features/orderSlice";

const AddNewOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menuList } = useSelector((state) => state.order);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [openCategory, setOpenCategory] = useState(null); 

  useEffect(() => {
    if (menuList.length > 0) {
      setCart(menuList[0]);
    }
  }, [menuList]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await new MenuService().getAll();
        if (response.data.success) {
          setMenuData(response.data.data);
        } else {
          console.error("Failed to fetch menu data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const updateCart = (id, name, price, action) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);

      if (action === "add") {
        return existingItem
          ? prevCart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevCart, { id, name, price, quantity: 1 }];
      }

      if (action === "remove" && existingItem) {
        return existingItem.quantity > 1
          ? prevCart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
          : prevCart.filter((item) => item.id !== id);
      }

      return prevCart;
    });
  };

  const calculateTotalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const menuItem = menuData.find((menu) => menu.id === item.id);
      return sum + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  }, [cart, menuData]);

  const calculateTotalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleConfirmOrder = () => {
    if (!cart.length) {
      alert("Please add at least one item before confirming the order.");
      return;
    }

    dispatch(addOrderItem({ menuList: cart, totalCount: calculateTotalPrice }));
    setCart([]);
    navigate("/order");
  };

  const groupedMenu = useMemo(() => {
    const groups = {};
    menuData.forEach((item) => {
      const groupName = item.menuGroup.name;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });
    return groups;
  }, [menuData]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          position: "relative",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", left: 0 }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant="h6">Choose Your Orders</Typography>
      </Box>

      <Paper elevation={3} sx={{ padding: "8px 16px", borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Count: {calculateTotalCount}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Price: AZN {calculateTotalPrice}
          </Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        Object.keys(groupedMenu).map((category) => (
          <Box key={category} sx={{ margin: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                setOpenCategory(openCategory === category ? null : category)
              }
              sx={{ marginBottom: 1 }}
            >
              {category}
            </Button>
            <Collapse in={openCategory === category}>
              <List>{console.log(cart)
              }
                {groupedMenu[category].map(({ id, name, price }) => {
                  const item = cart.find((cartItem) => cartItem.id === id);
                  const itemCount = item ? item.quantity : 0;

                  return (
                    <ListItem key={id} sx={{ borderBottom: "1px solid #ddd" }}>
                      <ListItemText primary={name} secondary={`AZN ${price}`} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => updateCart(id, name, price, "add")}
                          sx={{
                            backgroundColor: "#0008ff",
                            color: "white",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#0008ff" },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{ display: "inline-block", mx: 2 }}
                        >
                          {itemCount}
                        </Typography>
                        <IconButton
                          edge="end"
                          onClick={() => updateCart(id, name, price, "remove")}
                          color="error"
                          disabled={itemCount === 0}
                          sx={{
                            backgroundColor: "#ad0e29",
                            color: "white",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#ad0e29" },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        ))
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 3 }}
        onClick={handleConfirmOrder}
      >
        Confirm Order
      </Button>
    </Container>
  );
};

export default AddNewOrder;
