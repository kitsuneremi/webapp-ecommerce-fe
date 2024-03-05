'use client'
import { DatePicker, InputNumber } from 'antd/lib';
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
import ListTable from '../../components/voucher/listTable'
import { CustomerResponse, ProductResponse, VoucherResponse } from '../../lib/type';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useAppSelector } from '../../redux/storage';
import ReduxProvider from '../../redux/provider'
import { zodResolver } from "@hookform/resolvers/zod"
import ListCustomer from '../../components/voucher/listCustomer'
const { RangePicker } = DatePicker

const formSchema = z.object({
    code: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    value: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    target_type: z.enum(["0", "1"], {
        required_error: "You need to select a notification type.",
    }),
    discount_type: z.enum(["0", "1"], {
        required_error: "You need to select a notification type.",
    }),
    description: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    order_min_value: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    max_discount_value: z.number().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    usage_limit: z.number().min(2, {
        message: "Username must be at least 2 characters.",
    })
})

const VoucherPage = (): JSX.Element => {

    const form = useForm<z.infer<typeof formSchema>>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                code: makeid(),
                name: "",
                description: "",
                discount_type: "0",
                max_discount_value: 0,
                order_min_value: "0",
                target_type: "0",
                usage_limit: 0,
                value: "0"
            },
            mode: 'all'
        }
    )
    const { toast } = useToast();

    const selectedCustomer = useAppSelector(state => state.voucherReducer.value.selected)

    const path = useSearchParams();
    const [panel, setPanel] = useState<number>(0);

    const [targetVoucher, setTargetVoucher] = useState<VoucherResponse>()

    const [data, setData] = useState<VoucherResponse[]>([]);


    const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs(new Date()), dayjs(new Date())]);


    useEffect(() => {
        setDate([dayjs(Date.now()), dayjs(Date.now())])
    }, [])

    useEffect(() => {
        axios.get(`/api/voucher`).then(res => {
            setData(res.data);
        })
    }, [])



    useEffect(() => {
        if (path && path.get("id")) {
            axios.get(`/api/voucher/data?id=${path.get("id")}`).then(res => {
                setTargetVoucher(res.data)
            });
            setPanel(1);
        }
    }, [path])



    const handleSubmitForm = (values) => {
        axios.post(`${baseUrl}/voucher`, {
            code: values.code,
            name: values.name,
            value: values.value,
            targetType: values.target_type,
            usageLimit: values.usage_limit,
            discountType: values.discount_type,
            orderMinValue: values.order_min_value,
            startDate: date[0].toDate(),
            endDate: date[1].toDate(),
            lstCustomer: selectedCustomer.map(val => { return val.id }).toString()
        })
    }


    return (
        <DashboardLayout>
            <div className="p-6">
                <p className='my-2 text-lg font-semibold'>Voucher</p>
                <div className="w-full flex mb-3 relative after:absolute after:w-full after:bottom-0 after:left-0 after:h-[1px] after:bg-slate-600 after:bg-opacity-35">
                    <button onClick={() => { setPanel(0) }} className={`px-5 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 0 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        Danh sách voucher
                    </button>
                    <button onClick={() => { setPanel(1) }} className={`px-3 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 1 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        {targetVoucher ? 'Cập nhật voucher' : 'Thêm voucher mới'}
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
                                <Form {...form}>
                                    <form className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>tên voucher</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>mã voucher</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="discount_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hình thức giảm giá</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup className="flex gap-3 items-center">
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="0" id="option-one" />
                                                                <Label htmlFor="option-one">giảm trực tiếp</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="1" id="option-two" />
                                                                <Label htmlFor="option-two">%</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="max_discount_value"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mức giảm tối đa</FormLabel>
                                                    <FormControl>
                                                        <InputNumber className='w-full' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="usage_limit"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Giới hạn số lượng</FormLabel>
                                                    <FormControl>
                                                        <InputNumber className='w-full' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Mô tả</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="mô tả" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="target_type"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabel>Đối tượng áp dụng</FormLabel>
                                                    <FormControl defaultValue={0}>
                                                        <RadioGroup className="flex gap-3 items-center">
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="0" id="option-one" />
                                                                <Label htmlFor="option-one">vận chuyển</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="1" id="option-two" />
                                                                <Label htmlFor="option-two">đơn hàng</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className='mt-3'>
                                            <label>
                                                <p className='mb-1 text-sm text-slate-600'>Ngày bắt đầu {"->"} ngày kết thúc</p>
                                                <RangePicker className='w-full' value={date} onChange={(val) => { if (val) { setDate(val) } }} showTime />
                                            </label>
                                        </div>
                                        <Button type="submit" onClick={() => { handleSubmitForm(form.getValues()) }}>Submit</Button>
                                    </form>
                                </Form>

                            </div>
                            <div className='flex-grow'>
                                <ListCustomer />
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
        <ReduxProvider><VoucherPage></VoucherPage></ReduxProvider>
    )
}

export default Layout