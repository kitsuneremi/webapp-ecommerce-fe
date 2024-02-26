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
type FieldType = {
    name: string,
    value: string,
    description: string,
    date: [Dayjs, Dayjs]
};

const { RangePicker } = DatePicker

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const PromotionPage = (props): JSX.Element => {

    const { toast } = useToast();

    const path = useSearchParams();
    const [panel, setPanel] = useState<number>(0);
    const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(new Date()), dayjs(new Date())]);
    const [targetPromotion, setTargetPromotion] = useState<PromotionResponse>()

    const [data, setData] = useState<PromotionResponse[]>([]);
    const [listProduct, setListProduct] = useState<ProductResponse[]>([]);

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
        if (date) {
            // const data = {
            //     code: makeid(),
            //     name: values.name,
            //     description: values.description,
            //     quantity: values.quantity,
            //     startDate: dayjs(values.date[0]).toDate(),
            //     endDate: dayjs(values.date[1]).toDate(),
            // }


            // axios.post(`${baseUrl}/promotion`, {

            // }).then(res => {
            //     toast({
            //         title: res.data.title,
            //         description: res.data.des
            //     })
            //     if (res.data.status == "Success") {
            //         redirect(`/promotion/${res.data.data.id}`)
            //     }
            // })
        }
    }

    const handleUpdateForm = (values: any) => {
        if (date) {
            const data = {
                id: values.id,
                code: values.code,
                name: values.name,
                description: values.description,
                quantity: values.quantity,
                startDate: dayjs(values.date[0]).toDate(),
                endDate: dayjs(values.date[1]).toDate(),
            }
            axios.put(`${baseUrl}/promotion/${values.id}`, data).then(res => {
                toast({
                    title: res.data.title,
                    description: res.data.des
                })
                if (res.data.status == "Success") {
                    redirect(`/promotion/${res.data.data.id}`)
                }
            })
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
                        Thêm đợt giảm giá mới
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
                        <div className='w-full flex justify-center p-5'>
                            <div className='flex flex-col gap-3'>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>tên chương trình giảm giá</p>
                                    <Input value={targetPromotion ? targetPromotion.name : ""} />
                                </label>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>mã chương trình giảm giá</p>
                                    <Input value={targetPromotion ? targetPromotion.code : ""} />
                                </label>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>giá trị giảm (d)</p>
                                    <InputNumber value={targetPromotion ? targetPromotion.value : 0} />
                                </label>
                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>mô tả</p>
                                    <Textarea value={targetPromotion ? targetPromotion.description : ""} onChange={e => { setTargetPromotion(prev => { return { ...prev, description: e.target.value } }) }} />
                                </label>

                                <label>
                                    <p className='mb-1 text-sm text-slate-600'>ngày bắt đầu {"->"} ngày kết thúc</p>
                                    <RangePicker value={date} onChange={(val) => { setDate(val) }} showTime />
                                </label>
                                <Button onClick={() => { handleSubmitForm() }} type='primary' className='bg-blue-500'>
                                    Submit
                                </Button>
                            </div>
                            <div>
                                <ListDetailProduct data={listProduct} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </DashboardLayout>
    )
}


export default PromotionPage