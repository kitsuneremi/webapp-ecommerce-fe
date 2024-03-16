import { Button, Space, Table, Tag, Form, Checkbox, DatePicker, InputNumber } from 'antd/lib';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { baseUrl } from '../../../../lib/functional';
import { useToast } from '@/components/ui/use-toast';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard/layout';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductResponse, PromotionResponse } from '../../../../lib/type';
import ListDetailProduct from '../../../../components/promotion/listDetailProduct'
import { useAppSelector } from '../../../../redux/storage';
import ReduxProvider from '../../../../redux/provider'
import { useDispatch } from 'react-redux';
import { set, updateSelected } from '../../../../redux/features/promotion-selected-item'

export default function Detail(props) {

    const [targetPromotion, setTargetPromotion] = useState<PromotionResponse>()

    const path = usePathname();
    useEffect(() => {
        if (path && path?.split('/')[3]) {
            axios.get(`${baseUrl}/promotion/${path?.split('/')[3]}`).then(res => {
                setTargetPromotion(res.data)
            });
        }
    }, [path])

    return (
        <div className='p-4 flex flex-col gap-2'>
            <div className='grid grid-cols-2 gap-2'>
                <p className='text-lg font-semibold'>Tên chương trình: {targetPromotion?.name}</p>
                <p className='text-lg font-semibold'>Mã chương trình giảm giá: {targetPromotion?.code}</p>
                <p className='text-lg font-semibold'>Trạng thái: {targetPromotion?.status}</p>
                <p className='text-lg font-semibold'>Mô tả: {targetPromotion?.description}</p>
            </div>
            <p className='text-lg font-semibold'>Ngày hoạt động: {targetPromotion?.startDate + " - " + targetPromotion?.endDate}</p>
        </div>
    )
}