import React, { useState } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderService } from '../services/orderService';

const AddOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: id,
    docNumber: '',
    tableName: '',
    employeeName: '',
    openCheckAt: '',
    closeCheckAt: '',
    amount: 0,
    currency: 'AZN',
  });

  const [items, setItems] = useState([]); // Items state'i
  const [payments, setPayments] = useState([]); // Payments state'i

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangeItems = (e) => {
    const { name, value } = e.target;
    const { index } = e.target.dataset;
    setItems(prevItems => prevItems.map((item, i) => (i === parseInt(index) ? { ...item, [name]: value } : item)));
  };

  const handleChangePayments = (e) => {
    const { name, value } = e.target;
    const { index } = e.target.dataset; 
    setPayments(prevPayments => prevPayments.map((payment, i) => (i === parseInt(index) ? { ...payment, [name]: value } : payment)));
  };

  const handleAddItem = () => {
    setItems(prevItems => [
      ...prevItems,
      {
        itemName: '',
        itemSerial: '',
        itemQty: 0,
        itemAmount: 0,
        itemSumPR: 0,
        itemPrice: 0,
        itemStatus: 0
      }
    ]);
  };

  const handleAddPayment = () => {
    setPayments(prevPayments => [
      ...prevPayments,
      { cashAmount: 0, cashlessAmount: 0 }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderService = new OrderService();
    
    const updatedFormData = {
      ...formData,
      items: items,
      payments: payments
    };

    orderService.save(updatedFormData).then(res => {
      if(res.status === 200){
        navigate("/");
      }else if(res.status === 403){
        navigate("/login")
      }
    }).catch(e => console.log(e));
  };

  return (
    <form style={{ width: '50%', margin: 'auto' }} onSubmit={handleSubmit}>
      <MDBInput className='mb-4' label='Document Number' type='text' name='docNumber' onChange={handleChange} />
      <MDBInput className='mb-4' label='Table Name' type='text' name='tableName' onChange={handleChange} />
      <MDBInput className='mb-4' label='Employee Name' type='text' name='employeeName' onChange={handleChange} />
      <MDBInput className='mb-4' label='Open Check At' type='datetime-local' name='openCheckAt' onChange={handleChange} />
      <MDBInput className='mb-4' label='Close Check At' type='datetime-local' name='closeCheckAt' onChange={handleChange} />
      <MDBInput className='mb-4' label='Amount' type='number' name='amount' onChange={handleChange} />
      <label htmlFor="currency" className="form-label">Currency:</label>
      <select className="form-select mb-4" id="currency" name="currency" value={formData.currency} onChange={handleChange}>
        <option value="AZN">AZN</option>
        <option value="RUB">RUB</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>

      <div className="mb-4">
        <h5>Items</h5>
        {items.map((item, index) => (
          <div key={index}>
            <MDBInput className='mb-2' label={`Item Name ${index + 1}`} type='text' data-index={index} name='itemName' onChange={handleChangeItems} />
            <MDBInput className='mb-2' label={`Item Serial ${index + 1}`} type='text' data-index={index} name='itemSerial' onChange={handleChangeItems} />
            <MDBInput className='mb-2' label={`Item Quantity ${index + 1}`} type='number' data-index={index} name='itemQty' onChange={handleChangeItems} />
            <MDBInput className='mb-2' label={`Item Amount ${index + 1}`} type='number' data-index={index} name='itemAmount' onChange={handleChangeItems} />
            <MDBInput className='mb-2' label={`Item SumPR ${index + 1}`} type='number' data-index={index} name='itemSumPR' onChange={handleChangeItems} />
            <MDBInput className='mb-2' label={`Item Price ${index + 1}`} type='text' data-index={index} name='itemPrice' onChange={handleChangeItems} />
            <MDBInput className='mb-2' label={`Item Status ${index + 1}`} type='number' data-index={index} name='itemStatus' onChange={handleChangeItems} />
          </div>
        ))}
        <MDBBtn type='button' onClick={handleAddItem} size="sm">Add Item</MDBBtn>
      </div>
      
      <div className="mb-4">
        <h5>Payments</h5>
        {payments.map((payment, index) => (
          <div key={index}>
            <MDBInput className='mb-2' label={`Cash Amount ${index + 1}`} type='number' data-index={index} name='cashAmount' onChange={handleChangePayments} />
            <MDBInput className='mb-2' label={`Cashless Amount ${index + 1}`} type='number' data-index={index} name='cashlessAmount' onChange={handleChangePayments} />
          </div>
        ))}
        <MDBBtn type='button' onClick={handleAddPayment} size="sm">Add Payment</MDBBtn>
      </div>
      
      <MDBBtn type='submit'>Submit</MDBBtn>
    </form>
  );
};

export default AddOrder;
