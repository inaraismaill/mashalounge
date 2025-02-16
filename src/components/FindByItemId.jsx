import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemExpenseService } from "../services/itemExpenseService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const FindByItemId = () => {
  const { itemId } = useParams();
  const [InnerItemExpenses, setInnerItemExpenses] = useState([]);

  useEffect(() => {
    const itemExpenseService = new ItemExpenseService();

    itemExpenseService
      .findByItemId(itemId)
      .then((res) => {
        setInnerItemExpenses(res.data.data.content);
        console.log(res.data.data.content);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, [itemId]);

  return (
    <div>
      <h2>Expenses for Item {itemId}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item Expense Name</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Inner Group Name</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {InnerItemExpenses.length > 0 ? (
              InnerItemExpenses.map((expense, index) => (
                <TableRow key={expense.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{expense.itemExpenseName}</TableCell>
                  <TableCell>{expense.groupName}</TableCell>
                  <TableCell>{expense.innerGroupName}</TableCell>
                  <TableCell>{expense.supplierName}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.quantity}</TableCell>
                  <TableCell>{expense.totalAmount}</TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  No expenses found for this item.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FindByItemId;
