import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Selected } from '../../lib/type';

type Init = {
    value: {
        selected: Selected[];
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
    },
});

export default selectedData.reducer;
export const { set } = selectedData.actions;
