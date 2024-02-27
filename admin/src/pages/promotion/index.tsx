'use client'
import { Button, Space, Table, Tag, Form, Checkbox, DatePicker, InputNumber } from 'antd/lib';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { TableProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { baseUrl } from '../../lib/functional';
import { useToast } from '@/components/ui/use-toast';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { makeid } from '../../lib/functional';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import ListTable from '../../components/promotion/listTable'
import { ProductResponse, PromotionResponse } from '../../lib/type';
import ListDetailProduct from '../../components/promotion/listDetailProduct'
import { useAppSelector } from '../../redux/storage';
import ReduxProvider from '../../redux/provider'
const { RangePicker } = DatePicker

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const PromotionPage = (): JSX.Element => {

    const { toast } = useToast();

    const path = useSearchParams();
    const [panel, setPanel] = useState<number>(0);

    const [targetPromotion, setTargetPromotion] = useState<PromotionResponse>()

    const [data, setData] = useState<PromotionResponse[]>([]);
    const [listProduct, setListProduct] = useState<ProductResponse[]>([]);

    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [value, setValue] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(new Date()), dayjs(new Date())]);

    const listSelectedProduct = useAppSelector(state => state.promotionReducer.value.selected)

    useEffect(() => {
        axios.get(`${baseUrl}/promotion`).then(res => {
            setData(res.data);
            setDate([dayjs(res.data.startDate), dayjs(res.data.endDate)])
        })
    }, [])

    useEffect(() => {
        axios.get(`${baseUrl}/product`).then(res => { setListProduct(res.data) })
    }, [])

    useEffect(() => {
        if (path.get("id")) {
            axios.get(`${baseUrl}/promotion/${path.get("id")}`).then(res => {
                setTargetPromotion(res.data)
            });
            setPanel(1);
        }
    }, [path])

    const handleSubmitForm = () => {
        console.log(targetPromotion + " " + date);
        console.log(listSelectedProduct);
        let lst = []
        listSelectedProduct.map(value => {
            value.children.map(child => {
                if(child.selected){lst.push(child.id)}
            })
        })
        if (!date) {

        } else if (name.trim().length == 0) {
            toast({
                title: 'chưa nhập tên chương trình'
            })
        }else if(lst.length == 0){
            toast({
                title: 'chưa chọn sản phẩm nào'
            })
        }else if(value.toString().trim().length == 0){
            toast({
                title: 'đặt mức giảm giá'
            })
        } else {
            if(targetPromotion){
                axios.post(`${baseUrl}/promotion`, {
                    status: 0,
                    value: value,
                    code: makeid(),
                    name: name,
                    description: description,
                    startDate: dayjs(date[0]).toDate(),
                    endDate: dayjs(date[1]).toDate(),
                    lstPromotionDetails: lst.toString()
                }).then(res => {
                    toast({
                        title: res.data.title,
                        description: res.data.des
                    })
                    if (res.data.status == "Success") {
                        redirect(`/promotion?id=${res.data.data.id}`)
                    }
                })
            }else{
                axios.put(`${baseUrl}/promotion`, targetPromotion).then(res => {
                    toast({
                        title: res.data.title,
                        description: res.data.des
                    })
                    if (res.data.status == "Success") {
                        redirect(`/promotion?id=${res.data.data.id}`)
                    }
                })
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <p>Sự kiện giảm giá</p>
                <div className="w-full flex mb-3 relative after:absolute after:w-full after:bottom-0 after:left-0 after:h-[1px] after:bg-slate-600 after:bg-opacity-35">
                    <button onClick={() => { setPanel(0) }} className={`px-5 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 0 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        Danh sách đợt giảm giá
                    </button>
                    <button onClick={() => { setPanel(1) }} className={`px-3 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 1 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        {targetPromotion ? 'Cập nhật đợt giảm giá' : 'Thêm đợt giảm giá mới'}
                    </button>
                </div>
                <div>
                    {panel == 0 &&
                        <>
                            <div className="flex gap-5">
                                <Input placeholder="Basic usage" />
                            </div>
                            <div className='mt-5'>
                                <ListTable data={data} />
                            </div>
                        </>
                    }
                    {
                        panel == 1 &&
                        <div className='w-full flex justify-center p-5 gap-5'>
                            <div className='flex flex-col gap-3 w-5/12'>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>Tên chương trình giảm giá</p>
                                    <Input value={targetPromotion ? targetPromotion.name : name} onChange={e => { targetPromotion ? setTargetPromotion(prev => { return { ...prev, name: e.target.value } }) : setName(e.target.value) }} />
                                </label>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>Mã chương trình giảm giá</p>
                                    <Input value={targetPromotion ? targetPromotion.code : code} onChange={e => { targetPromotion ? setTargetPromotion(prev => { return { ...prev, code: e.target.value } }) : setCode(e.target.value) }} />
                                </label>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>Giá trị giảm (d)</p>
                                    <InputNumber min={0} className='w-full' value={targetPromotion ? targetPromotion.value : value} onChange={e => { targetPromotion ? setTargetPromotion(prev => { return { ...prev, value: e } }) : setValue(e) }} />
                                </label>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>Mô tả</p>
                                    <Textarea value={targetPromotion ? targetPromotion.description : description} onChange={e => { targetPromotion ? setTargetPromotion(prev => { return { ...prev, description: e.target.value } }) : setDescription(e.target.value) }} />
                                </label>

                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                                    <RangePicker className='w-full' value={date} onChange={(val) => { setDate(val) }} showTime />
                                </label>
                                <Button onClick={() => { handleSubmitForm() }} type='primary' className='bg-blue-500'>
                                    {targetPromotion ? 'Cập nhật' : 'Tạo mới'}
                                </Button>
                            </div>
                            <div className='flex-grow'>
                                <ListDetailProduct data={listProduct} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </DashboardLayout>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><PromotionPage></PromotionPage></ReduxProvider>
    )
}

export default Layout