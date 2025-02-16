import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tableId: null,
    tableName: null,
    candidateId: null,
    candidateName: null,
    waiterId: null,
    time: null,
    orderId: null,
    waiterName: null,
    menuList: [],
    count: 0,
    totalCount: 0,
    orderStatus: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addCandidate: (state, action) => {
            state.candidateId = action.payload.candidateId;
            state.candidateName = action.payload.candidateName;

            state.count = action.payload.count;
        },
        addWaiter: (state, action) => {
            state.waiterId = action.payload.positionId;
            state.waiterName = action.payload.positionName;
        },
        addOrderId: (state, action) => {
            state.orderId = action.payload.orderId;
        },
        addTime: (state, action) => {
            state.time = action.payload.time;
        },
        selectTable: (state, action) => {
            state.tableId = action.payload.tableId;
            state.tableName = action.payload.tableName;
        },
        addOrderItem: (state, action) => {
            const { menuList, totalCount } = action.payload;

            if (state.menuList.length === 0) {
                state.menuList = [menuList];
            } else {
                state.menuList[0] = menuList;
            }
            state.totalCount = totalCount

        },
        confirmOrder: (state) => {
            state.orderStatus = 'confirmed';
        },
        resetOrder: () => {
            return { ...initialState };
        },

    },
})

export const {
    addCandidate, addWaiter, addTime,
    selectTable,
    resetOrder,
    confirmOrder,addOrderId,
    addOrderItem,
} = orderSlice.actions

export default orderSlice.reducer
