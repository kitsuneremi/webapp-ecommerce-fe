'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import { vnData } from '@/lib/extra'
import { Select, Input, Table } from 'antd'
import type { TableProps } from 'antd';
import { CartDetailResponse } from '@/lib/types'


const columns: TableProps<CartDetailResponse>['columns'] = [
    {
        title: 'Mã',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: ((_, record) => {
            return <Image src={'https://product.hstatic.net/1000304367/product/olv232239-2_7039b25098644daaba0575828b9458ba_grande.jpg'} width={90} height={90} alt='' />
        })
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        render: ((_, record) => {
            return <div>
                <p className='tex-lg font-bold'>{"name"}</p>
                <p className='text-sm font-thin text-slate-600'>{"des"}</p>
            </div>
        })
    },
    {
        title: 'quan',
        dataIndex: 'quantity',
        key: 'quantity',
        render: ((_, record) => {
            return <p>{record.quantity}</p>
        })
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <div>
                <a>Delete</a>
            </div>
        ),
    },
];

const data: CartDetailResponse[] = [
    {
        cart: 1,
        id: 1,
        productDetails: {
            id: 12,
            barcode: "asdsada",
            code: "asdasd",
            imageUrl: "",
            price: 50000,
            product: {
                category: 1,
                description: "des",
                id: 16,
                imageUrl: "",
                name: "product test name"
            },
            quantity: 300,
            status: 1
        },
        quantity: 200
    }
]

export default function Checkout() {

    const [selectProvince, setSelectProvince] = useState<number>(1);
    const [selectDistrict, setSelectDistrict] = useState<number>();
    const [selectWard, setSelectWard] = useState<number>();

    const [listDistricts, setListDistricts] = useState<any[]>([]);
    const [listWards, setListWards] = useState<any[]>([]);

    useEffect(() => {
        const province = vnData.find(target => { return target.code == selectProvince });
        if (province) {
            setListDistricts(province.districts)
            setSelectDistrict(province.districts[0].code)
        }
    }, [selectProvince])

    useEffect(() => {
        if (selectDistrict && listDistricts.length > 0) {
            const t = listDistricts.find(target => { return target.code == selectDistrict }).wards;
            setListWards(t)
            setSelectWard(t[0].code)
        }
    }, [selectDistrict, listDistricts])

    return (
        <div className="flex mt-32 min-h-[calc(100vh-256px)] px-[14%] gap-8">
            <div className="w-1/2 flex flex-col gap-5 mt-5">
                <p className="text-2xl font-bold text-slate-600">Alice store</p>
                <p>Thông tin giao hàng</p>
                <div className="flex gap-3 items-center">
                    <div className="relative w-14 h-14">
                        <Image src={'https://www.gravatar.com/avatar/587b2b271e5f735dfd538221d626a0ab.jpg?s=100&d=blank'} alt="" fill />
                    </div>
                    <div className="flex flex-col gap-3 ">
                        <p>username (username@gmail.com)</p>
                        <p className="text-cyan-400">Logout</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Input placeholder="full name" />
                    <Input placeholder="sdt" />
                    <Select className="z-[1000]" defaultValue={1} placeholder='Tình/ Thành phố' value={selectProvince} onChange={value => { setSelectProvince(value) }}>
                        {vnData.map((province) => {
                            return <option key={province.code} value={province.code}>{province.name}</option>
                        })}
                    </Select>

                    <Select className="z-[1000]" placeholder='Quận/Huyện' value={selectDistrict} onChange={value => { setSelectDistrict(value) }}>
                        {
                            listDistricts.map(district => {
                                return <option key={district.code} value={district.code}>{district.name}</option>
                            })
                        }
                    </Select>
                    <Select className="z-[1000]" placeholder='Xã/Thị trấn' value={selectWard} onChange={value => { setSelectWard(value) }}>
                        {
                            listWards.map(ward => {
                                return <option key={ward.code} value={ward.code}>{ward.name}</option>
                            })
                        }
                    </Select>


                    <div className="w-full flex justify-end mt-5">
                        <button className="px-3 py-2 font-bold bg-cyan-400 text-slate-100">Xác nhận và thanh toán</button>
                    </div>
                </div>
            </div>
            <div className="w-1/2 flex flex-col mt-5 gap-5">
                <div>
                    <Table className='w-full' columns={columns} dataSource={data} />
                </div>

                <div className="flex gap-3">
                    <Input placeholder="mã giảm giá" />
                    <button className="px-3 py-2 whitespace-nowrap bg-cyan-400 text-slate-100 font-bold rounded-lg">Sử dụng</button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="w-full flex justify-between">
                        <p>Tạm tính:</p>
                        <p>500.000d</p>
                    </div>
                    <div className="w-full flex justify-between">
                        <p>Phí vận chuyển:</p>
                        <p>23.000d</p>
                    </div>
                    <div className="relative after:absolute after:w-full after:h-[1px] after:bg-slate-600 after:left-0 after:bottom-0"></div>
                    <div className="w-full flex justify-between">
                        <p>Tổng tiền:</p>
                        <p>523.000d</p>
                    </div>
                </div>
            </div>
        </div>
    )
}