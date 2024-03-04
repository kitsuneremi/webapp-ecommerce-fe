import { configureStore } from '@reduxjs/toolkit'
import promotionReducer from './features/promotion-selected-item'
import sidebarReducer from './features/sidebar-slice'
import voucherReducer from './features/voucher-selected-item'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storage = configureStore({
    reducer: {
        promotionReducer,
        voucherReducer,
        sidebarReducer
    }
})

export type RootState = ReturnType<typeof storage.getState>
export type AppDispatch = typeof storage.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector