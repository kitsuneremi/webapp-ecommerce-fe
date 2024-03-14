import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SelectedProductDetail } from '../../lib/type';

type Init = {
    value: {
        selected: SelectedProductDetail[];
    };
};

export const selectedData = createSlice({
    name: 'selectedCustomer',
    initialState: {
        value: {
            selected: [],
        },
    } as Init,
    reducers: {
        set: (state, action: PayloadAction<Init>) => {
            state.value.selected = action.payload.value.selected;
        },
        updateSelected: (state, action: PayloadAction<{ id: number; quantity: number, image: string, name: string, price: number, type: string }>) => {
            const { id, quantity, image, name, type, price } = action.payload;
            state.value.selected.push({ buy_quantity: quantity, detail_id: id, image: image, name: name, type: type, price: price })

        },
    },
});

export default selectedData.reducer;
export const { set, updateSelected } = selectedData.actions;
