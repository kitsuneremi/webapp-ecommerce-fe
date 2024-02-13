'use client'
import { useEffect, useState } from 'react'
import { FaProductHunt } from "react-icons/fa";
import { Input, Select } from 'antd'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import axios from 'axios'
import { baseUrl } from '@/lib/utils'
import { VoucherResponse } from '@/lib/types';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link'

const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export default function AccountPage() {
    const params = useSearchParams()
    const [panel, setPanel] = useState<number>(0);
    const [listVoucher, setListVoucher] = useState<VoucherResponse[]>([])

    useEffect(() => {
        axios.get(`${baseUrl}/voucher`).then(res => {
            setListVoucher(res.data)
        })
    }, [])

    useEffect(() => {
        let temp = params.get('panel');
        if(temp){
            setPanel(Number.parseInt(temp));
        }else{
            setPanel(0);
        }
    },[params])

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    return (
        <main className="flex min-h-[calc(100vh-128px)] mt-32 justify-between py-24 px-[14%] gap-24">
            <aside className="flex flex-col gap-5 min-w-max">
                <Link href={'/account?panel=0'}><p className="text-xl font-bold">Trung tâm cá nhân</p></Link>
                <div className="flex flex-col gap-3">
                <p className="text-xl font-bold">- Tài khoản của tôi</p>
                <Link href={'/account?panel=1'}><p className={`text-slate-500 ${panel == 1 ? 'text-slate-800 font-bold' : ''}`}>Thông tin của tôi</p></Link>
                <Link href={'/account?panel=2'}><p className={`text-slate-500 ${panel == 2 ? 'text-slate-800 font-bold' : ''}`}>Sổ địa chỉ</p></Link>
                <Link href={'/account?panel=3'}><p className={`text-slate-500 ${panel == 3 ? 'text-slate-800 font-bold' : ''}`}>Đo lường của tôi</p></Link>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-xl font-bold">- Quà tặng của Alice</p>
                    <Link href={'/account?panel=4'}><p className={`text-slate-500 ${panel == 4 ? 'text-slate-800 font-bold' : ''}`}>Phiếu giảm giá của tôi</p></Link>
                    <Link href={'/account?panel=5'}><p className={`text-slate-500 ${panel == 5 ? 'text-slate-800 font-bold' : ''}`}>Xu của tôi</p></Link>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-xl font-bold">- Đơn hàng của tôi</p>
                    <p className={`text-slate-500 ${panel == 6 ? 'text-slate-800 font-bold' : ''}`}>Tất cả đơn hàng</p>
                    <p className={`text-slate-500 ${panel == 7 ? 'text-slate-800 font-bold' : ''}`}>Đơn hàng đã mua</p>
                    <p className={`text-slate-500 ${panel == 8 ? 'text-slate-800 font-bold' : ''}`}>Đơn hàng đã hủy</p>
                    <p className={`text-slate-500 ${panel == 9 ? 'text-slate-800 font-bold' : ''}`}>Chưa đánh giá</p>
                    <p className={`text-slate-500 ${panel == 10 ? 'text-slate-800 font-bold' : ''}`}>Đã đánh giá</p>
                </div>
                <p className="text-xl font-bold">Đăng xuất</p>
            </aside>
            <div className='flex-grow'>
                {
                    panel == 0 && <>
                        <div className='w-full flex flex-col gap-2 p-5 border-slate-400 border-[1px]'>
                            <div className='w-full flex justify-between items-center'>
                                <p className='text-lg font-semibold'>Xin chào Phùng thúy Hiền</p>
                                <p className='text-slate-500 text-sm'>Thông tin của tôi {">"}</p>
                            </div>
                            <div className='flex gap-5'>
                                <div className='text-center'>
                                    <p>0</p>
                                    <p>Phiếu giảm giá</p>
                                </div>
                                <div className='text-center'>
                                    <p>0</p>
                                    <p>Xu Alice</p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 w-full flex flex-col gap-2 p-5 border-slate-400 border-[1px]'>
                            <div className='w-full flex justify-between items-center'>
                                <p className='text-lg font-semibold'>Đơn hàng của tôi</p>
                                <p className='text-slate-500 text-sm'>Xem tất cả {">"}</p>
                            </div>
                            <div className='flex gap-5'>
                                <div className='flex flex-col items-center'>
                                    <FaProductHunt />
                                    <p>Tất cả</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <FaProductHunt />
                                    <p>Đã mua</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <FaProductHunt />
                                    <p>Đã hủy</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <FaProductHunt />
                                    <p>Đánh giá</p>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {
                    panel == 1 && <div className='flex flex-col gap-5'>
                        <p className='uppercase text-3xl font-bold text-center'>thông tin của tôi</p>
                        <div className='flex flex-col gap-3'>
                            <p>Thông tin</p>
                            <div>
                                <p className='text-sm text-slate-500 mb-1'>Họ</p>
                                <Input placeholder="Họ" />
                            </div>
                            <div>
                                <p className='text-sm text-slate-500 mb-1'>Tên</p>
                                <Input placeholder="Tên" />
                            </div>
                            <div>
                                <p className='text-sm text-slate-500 mb-1'>Ngày sinh</p>
                                <DatePicker defaultValue={dayjs('01/01/2015', 'DD/MM/YYYY')} format={'DD/MM/YYYY'} />
                            </div>
                        </div>


                        <div className='relative after:absolute after:w-full after:bg-slate-300 after:h-[1px] after:bottom-0 after:left-0'></div>


                        <button className='px-3 py-1 bg-slate-900 text-lg font-bold text-slate-100 w-fit rounded-md'>Lưu thông tin</button>
                    </div>
                }

                {
                    panel == 2 && <div>
                        in progress...
                    </div>
                }

                {
                    panel == 3 && <div className='flex flex-col gap-5'>
                        <p className='text-slate-600 font-bold uppercase mb-2'>Các chỉ số của tôi</p>
                        <p className='text-sm text-slate-500'>
                            Các thông tin về chiều cao, cân nặng và các chỉ số cơ thể khác của bạn được cập nhật tại đây có thể giúp bạn lựa chọn size phù hợp với thông số đo sản phẩm mà chúng tôi cung cấp.
                            <br />
                            Tạo ra các bài đánh giá hữu ích có thông tin kích thước số đo cho các SomeHowers khác tham khảo.
                        </p>

                        <div className='grid grid-cols-2 max-lg:grid-cols-1 gap-3'>
                            <Select
                                showSearch
                                placeholder="Chọn chiều cao của bạn"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={[
                                    {
                                        value: '160cm',
                                        label: '160cm',
                                    },
                                    {
                                        value: '161cm',
                                        label: '161cm',
                                    },
                                    {
                                        value: '162cm',
                                        label: '162cm',
                                    },
                                ]}
                            />
                            <Select
                                showSearch
                                placeholder="Chọn cân nặng của bạn"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={[
                                    {
                                        value: '50kg',
                                        label: '50kg',
                                    },
                                    {
                                        value: '51kg',
                                        label: '51kg',
                                    },
                                    {
                                        value: '52kg',
                                        label: '52kg',
                                    },
                                ]}
                            />
                            <Select
                                showSearch
                                placeholder="Chọn chiều cao của bạn"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={[
                                    {
                                        value: '160cm',
                                        label: '160cm',
                                    },
                                    {
                                        value: '161cm',
                                        label: '161cm',
                                    },
                                    {
                                        value: '162cm',
                                        label: '162cm',
                                    },
                                ]}
                            />
                        </div>
                        <button className='px-3 py-1 bg-slate-900 text-lg font-bold text-slate-100 w-fit rounded-md'>Lưu thông tin</button>
                    </div>
                }

                {

                    panel == 4 && <div className='flex-grow flex flex-col gap-5'>
                        <p className='text-lg font-bold text-center'>Voucher có thể sử dụng</p>
                        <div className='flex flex-col gap-5 p-5 border-orange-400 border-[1px]'>
                            {listVoucher.length == 0 ? <p className='text-center text-sm text-orange-600 '>không có voucher nào</p> : listVoucher.map((vou, index) => {
                                return (
                                    <div className='' key={index}>
                                        <p className='text-lg font-semibold text-slate-600'>{vou.name}</p>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
        </main>
    )
}