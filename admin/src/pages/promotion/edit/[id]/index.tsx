'use client'
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
const { RangePicker } = DatePicker
function EditPage() {

    const { toast } = useToast();

    const dispatch = useDispatch();

    const path = usePathname()

    const [targetPromotion, setTargetPromotion] = useState<PromotionResponse>()

    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [value, setValue] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(new Date()), dayjs(new Date())]);

    const [listProduct, setListProduct] = useState<ProductResponse[]>([]);
    useEffect(() => {
        axios.get(`${baseUrl}/product`).then(res => { setListProduct(res.data) });
    }, [])

    const listSelectedProduct = useAppSelector(state => state.promotionReducer.value.selected)

    useEffect(() => {
        if (path && path?.split('/')[3]) {
            axios.get(`${baseUrl}/promotion/${path?.split('/')[3]}`).then(res => {
                setTargetPromotion(res.data)
                setName(res.data.name);
                setCode(res.data.code);
                setValue(res.data.value);
                setDescription(res.data.description);
                setDate([dayjs(res.data.startDate), dayjs(res.data.endDate)])

                res.data.lstPromotionDetails.map((detail) => {
                    dispatch(updateSelected({ id: detail.productDetails.id, selected: true }))
                })

            });
        }
    }, [path])

    const handleSubmitForm = () => {

        let lst: number[] = []
        listSelectedProduct.map(value => {
            value.children.map(child => {
                if (child.selected) { lst.push(child.id) }
            })
        })
        if (!date) {

        } else if (name.trim().length == 0) {
            toast({
                title: 'chưa nhập tên chương trình'
            })
        } else if (lst.length == 0) {
            toast({
                title: 'chưa chọn sản phẩm nào'
            })
        } else if (value.toString().trim().length == 0) {
            toast({
                title: 'đặt mức giảm giá'
            })
        } else {
            const t = {
                id: targetPromotion?.id,
                name: name,
                code: code,
                status: 0,
                value: value,
                description: description,
                startDate: dayjs(date[0]).toDate(),
                endDate: dayjs(date[1]).toDate(),
                lstProductDetails: lst
            }

            axios.put(`${baseUrl}/promotion/${t.id}`, t).then(res => {
                toast({
                    title: res.data.title,
                    description: res.data.des
                })
                if (res.data.status == "success") {
                    redirect(`/promotion?id=${targetPromotion!.id}`)
                }
            })
        }
    }

    return (
        <div className='w-full flex flex-col p-5 gap-5'>
            <div className='flex flex-col gap-3 w-full'>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Tên chương trình giảm giá</p>
                    <Input value={name} onChange={e => { setName(e.target.value) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                    <Input disabled value={code} onChange={e => { setCode(e.target.value) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Giá trị giảm (d)</p>
                    <InputNumber min={0} className='w-full' value={value} onChange={e => { if (e) setValue(e) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Mô tả</p>
                    <Textarea value={description} onChange={e => { setDescription(e.target.value) }} />
                </label>
                <label>
                    <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                    {/* @ts-ignore */}
                    <RangePicker className='w-full' value={date} onChange={(val) => { setDate(val) }} showTime />
                </label>
                <Button onClick={() => { handleSubmitForm() }} type='primary' className='bg-blue-500'>
                    {'Cập nhật'}
                </Button>
            </div>
            <div className='w-full'>
                <ListDetailProduct data={listProduct} />
            </div>
        </div>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><EditPage></EditPage></ReduxProvider>
    )
}

export default Layout