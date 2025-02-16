import { useEffect, useState } from 'react';
import { ItemService } from '../services/itemService';
import { MDBBtn, MDBCheckbox, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';

const Items = () => {
    const [datas, setDatas] = useState([]);
    const [basicModal, setBasicModal] = useState(false);
    const toggleOpen = () => setBasicModal(!basicModal);
    const [data, setData] = useState({});
    const [itemName, setItemName] = useState("");
    const [costPrice, setCostPrice] = useState(0.0);
    const [approximateCostPrice, setApproximateCostPrice] = useState(0.0);
    const [id, setId] = useState(0);
    const [teaChecked, setTeaChecked] = useState(false);
    const [barChecked, setBarChecked] = useState(false);
    const [hookahChecked, setHookahChecked] = useState(false);
    const [kitchenChecked, setKitchenChecked] = useState(false);
    const [setChecked, setSetChecked] = useState(false);
    const [resData, setResData] = useState()

    useEffect(() => {
        const itemService = new ItemService();
        itemService.getAll().then(res => setDatas(res.data.data));
    }, [resData]);

    const handleModal = (data) => {
        toggleOpen();
        setData(data);
        handleChecked(data);
        setItemName(data.itemName || "");
        setId(data.id || 0);
        setCostPrice(data.costPrice || 0.0); 
        setApproximateCostPrice(data.approximateCostPrice || 0.0); 
    };

    const handleChecked = (data) => {
        setTeaChecked(!!data.foodDepartment?.find(food => food.name === 'TEA'));
        setBarChecked(!!data.foodDepartment?.find(food => food.name === 'BAR'));
        setHookahChecked(!!data.foodDepartment?.find(food => food.name === 'HOOKAH'));
        setKitchenChecked(!!data.foodDepartment?.find(food => food.name === 'KITCHEN'));
        setSetChecked(!!data.foodDepartment?.find(food => food.name === 'SET'));
    };

    const handleSubmit = () => {
        const itemService = new ItemService();

        let array = [];
        if (teaChecked) array.push("tea");
        if (barChecked) array.push("bar");
        if (hookahChecked) array.push("hookah");
        if (kitchenChecked) array.push("kitchen");
        if (setChecked) array.push("set");

        const data = {
            id: id,
            itemName: itemName,
            costPrice: costPrice,
            approximateCostPrice : approximateCostPrice,
            foodDepartments: array
        };


        itemService.updateItem(data).then(res => {
            if (res.status === 200) {
               
                toggleOpen()
                setResData(res.data)
            }
        });
    };

    return (
        <div>
            <MDBTable>
                <MDBTableHead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Item serial</th>
                        <th scope="col">Item name</th>
                        <th scope="col">Item cost price</th>
                        <th scope="col">Approximate Cost Price</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Update</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {datas.map((data, i) => (
                        <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{data.itemSerial}</td>
                            <td>{data.itemName}</td>
                            <td>{data.costPrice}</td>
                            <td>{data.approximateCostPrice}</td>
                            <td>{data.foodDepartment?.map((food, index) => (
                                <p key={index}>{food?.name}</p>
                            ))}</td>
                            <td>
                                <MDBBtn onClick={() => handleModal(data)} className='me-1' color='warning'>
                                    Update
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <MDBModal open={basicModal} onClose={toggleOpen} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Update</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <MDBInput value={itemName} onChange={(e) => setItemName(e.target.value)} label="Item name" id="form1" type="text" />
                            <MDBInput value={costPrice} onChange={(e) => setCostPrice(e.target.value)} label="Cost price" id="form1" type="number" />
                            <MDBInput value={approximateCostPrice} onChange={(e) => setApproximateCostPrice(e.target.value)} label="Approximate Cost Price" id="form1" type="number" />
                            <MDBCheckbox checked={teaChecked} onChange={() => setTeaChecked(!teaChecked)} name='flexCheck' value='tea' id='flexCheckDefault' label='TEA' />
                            <MDBCheckbox checked={barChecked} onChange={() => setBarChecked(!barChecked)} name='flexCheck' value='bar' id='flexCheckChecked' label='BAR' />
                            <MDBCheckbox checked={hookahChecked} onChange={() => setHookahChecked(!hookahChecked)} name='flexCheck' value='hookah' id='flexCheckChecked' label='HOOKAH' />
                            <MDBCheckbox checked={kitchenChecked} onChange={() => setKitchenChecked(!kitchenChecked)} name='flexCheck' value='kitchen' id='flexCheckChecked' label='KITCHEN' />
                            <MDBCheckbox checked={setChecked} onChange={() => setSetChecked(!setChecked)} name='flexCheck' value='set' id='flexCheckChecked' label='SET' />
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={toggleOpen}>Close</MDBBtn>
                            <MDBBtn onClick={handleSubmit}>Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    );
}

export default Items;
