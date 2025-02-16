import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GroupExpenseService } from "../services/gruopExpenseService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const FindByGroupId = () => {
  const { groupId } = useParams();
  const [groupExpenses, setGroupExpenses] = useState([]);

  useEffect(() => {
    const groupExpenseService = new GroupExpenseService();

    groupExpenseService
      .findAllByGroupId(groupId)
      .then((res) => {
        setGroupExpenses(res.data.data.content);
        console.log(res.data.data.content);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, [groupId]);

  return (
    <div>
      <h2>Expenses for Group {groupId}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupExpenses.length > 0 ? (
              groupExpenses.map((expense, index) => (
                <TableRow key={expense.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.amount || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  No expenses found for this group.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FindByGroupId;
