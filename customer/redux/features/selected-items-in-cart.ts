import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Selected = { id: number, selected: boolean }

type init = {
    value: {
        selected: Selected[]
    }
}

export const sidebar = createSlice({
    name: 'lstId',
    initialState: {
        value: {
            selected: []
        }
    } as init,
    reducers: {
        set: (state, action: PayloadAction<init>) => {
            return {
                value: {
                    selected: action.payload.value.selected
                }
            }

        },
        updateSelected: (state, action: PayloadAction<{ id: number; selected: boolean }>) => {
            const { id, selected } = action.payload;
            const selectedItem = state.value.selected.find(item => item.id === id);
            if (selectedItem) {
                selectedItem.selected = selected;

            } else {
                state.value.selected.push({ id: id, selected: true });
            }
        },
    },

}
)

export default sidebar.reducer
export const { set, updateSelected } = sidebar.actions