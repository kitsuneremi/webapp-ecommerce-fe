'use client'
import { useState } from 'react'
import { CartDetailResponse } from '@/lib/types'
import Image from 'next/image'
import { Table } from 'antd'
import type { TableProps } from 'antd';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { FaCartShopping } from "react-icons/fa6";
import Link from 'next/link'


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
            return <Image src={'https://product.hstatic.net/1000304367/product/olv232239-2_7039b25098644daaba0575828b9458ba_grande.jpg'} width={160} height={120} sizes='2/3' alt='' />
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

export default function Cart() {

    const [listCart, setListCart] = useState<CartDetailResponse[]>([])

    return (
        <div className="flex mt-32 min-h-[calc(100vh-256px)] px-[14%] pt-6 flex-col gap-6">
            <>
                <p className="uppercase text-2xl font-bold">giỏ hàng của tôi</p>
                <div className="flex-grow flex justify-center">
                    {
                        listCart.length == 0
                            ?
                            <Table className='w-full' columns={columns} dataSource={data} />
                            :
                            <p>Giỏ hàng trống, hãy thêm gì đó nhé</p>
                    }
                </div>
                <div className='flex flex-col gap-5'>
                    <div className='flex justify-end gap-5'>
                        <p className='uppercase text-lg font-bold text-slate-700'>thành tiền</p>
                        <p className='text-lg font-bold text-slate-700'>1.000.000d</p>
                    </div>

                    <div className='flex justify-end'><p className='underline'>phiếu giảm giá của tôi</p></div>
                    <div className='flex justify-end'>
                        <Link href={'checkouts'}>
                            <button className='bg-cyan-400 px-4 py-3 font-bold text-slate-200'>THIS IS ORDER</button>
                        </Link>
                    </div>
                </div>
            </>
            {CarouselBox({ title: 'sản phẩm khác' })}
        </div>
    )
}



const CarouselBox = ({ title }: { title: string }) => {
    const Item = () => {
        return (
            <div className="">
                <div className="relative w-full aspect-[2/3] group">
                    <Image className="" src={'https://ae01.alicdn.com/kf/S9a61b504f25944d18d2d0aeab6d7c7e13.jpg_640x640Q90.jpg_.webp'} alt="" fill />
                    <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 font-bold text-xs text-white">còn hàng</div>
                    <div className="absolute top-2 right-2 cursor-pointer p-3 hidden rounded-full bg-slate-500 hover:bg-rose-200 group-hover:block">
                        <FaCartShopping />
                    </div>
                    <div className="absolute hidden bottom-0 left-0 w-full h-10 bg-slate-300 bg-opacity-65 group-hover:flex items-center justify-center">
                        <p className="text-xl uppercase">Xem nhanh</p>
                    </div>
                </div>
                <div className="">
                    <p>Ella fronta dress</p>
                    <p>790.000d</p>
                </div>
            </div>
        )

    }

    const FakeItem = () => {
        return (
            <div className="">
                <div className="relative w-full aspect-[2/3] group">
                    <Image className="" src={'https://i.ebayimg.com/images/g/HQIAAOSwBvpkhtLO/s-l1200.webp'} alt="" fill />
                    <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 font-bold text-xs text-white">còn hàng</div>
                    <div className="absolute top-2 right-2 cursor-pointer p-3 hidden rounded-full bg-slate-500 hover:bg-rose-200 group-hover:block">
                        <FaCartShopping />
                    </div>
                    <div className="absolute hidden bottom-0 left-0 w-full h-10 bg-slate-300 bg-opacity-65 group-hover:flex items-center justify-center">
                        <p className="text-xl uppercase">Xem nhanh</p>
                    </div>
                </div>
                <div className="">
                    <p>Ella fronta dress</p>
                    <p>790.000d</p>
                </div>
            </div>
        )

    }

    return (
        <div className="flex flex-col gap-10 w-full my-6">
            <div className="flex w-full justify-center text-center">
                <p className="text-4xl uppercase font-bold">{title}</p>
            </div>
            <div>
                <Carousel className="w-full">
                    <CarouselPrevious />
                    <CarouselContent>
                        <CarouselItem className="basis-1/4 select-none">{Item()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{FakeItem()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{Item()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{FakeItem()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{FakeItem()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{Item()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{Item()}</CarouselItem>
                        <CarouselItem className="basis-1/4 select-none">{Item()}</CarouselItem>
                    </CarouselContent>
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}
