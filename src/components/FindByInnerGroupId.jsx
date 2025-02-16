import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { InnerGroupExpenseService } from "../services/innerGroupExpenseService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const FindByInnerGroupId = () => {
  const { innerGroupId } = useParams();
  const [innerGroupExpenses, setInnerGroupExpenses] = useState([]);

  useEffect(() => {
    const innerGroupExpenseService = new InnerGroupExpenseService();

    innerGroupExpenseService
      .findAllByInnerGroupId(innerGroupId)
      .then((res) => {
        setInnerGroupExpenses(res.data.data.content);
        console.log(res.data.data.content);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, [innerGroupId]);

  return (
    <div>
      <h2>Expenses for Group {innerGroupId}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Group Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {innerGroupExpenses.length > 0 ? (
              innerGroupExpenses.map((expense, index) => (
                <TableRow key={expense.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.groupExpense.name}</TableCell>
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

export default FindByInnerGroupId;
