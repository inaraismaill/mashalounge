import { useNavigate, useParams } from "react-router-dom";
import { ExpenseService } from "../services/expenseService";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const ExpenseDetail = () => {
  const expenseService = new ExpenseService();
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    expenseService
      .findById(id)
      .then((res) => {
        setData(res.data.data);
      })
      .catch(() => navigate("/login"));
  }, []);

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item Expense Name</TableCell>
              <TableCell>Inner Group Name</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Updated By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && (
              <TableRow>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.itemExpense?.name || ""}</TableCell>
                <TableCell>{data.itemExpense.innerGroupExpense?.name || ""}</TableCell>
                <TableCell>{data.itemExpense.groupExpense?.name || ""}</TableCell>
                <TableCell>{data.itemExpense.unite?.name || ""}</TableCell>
                <TableCell>{data.itemExpense.supplier?.name || ""}</TableCell>
                <TableCell>{data?.amount || ""}</TableCell>
                <TableCell>{data?.quantity || ""}</TableCell>
                <TableCell>{data?.totalAmount || ""}</TableCell>
                <TableCell>{data?.date || ""}</TableCell>
                <TableCell>{data?.createdBy || ""}</TableCell>
                <TableCell>{data?.updatedBy || ""}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExpenseDetail;
