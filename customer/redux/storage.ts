import { configureStore } from '@reduxjs/toolkit'
import selectedItem from './features/selected-items-in-cart'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storage = configureStore({
    reducer: {
        selectedItem
    }
})


export type RootState = ReturnType<typeof storage.getState>
export type AppDispatch = typeof storage.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector