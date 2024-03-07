'use client'
import { useState, useMemo, useEffect } from 'react'
import { CartDetailResponse } from '@/lib/types'
import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { FaCartShopping } from "react-icons/fa6";
import Link from 'next/link'
import { useAppSelector } from '@/redux/storage'
import { set, updateSelected } from '@/redux/features/selected-items-in-cart'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import axios from 'axios'
import { baseUrl } from '@/lib/utils'


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

    const [sorting, setSorting] = useState<SortingState>([])
    const [listCart, setListCart] = useState<CartDetailResponse[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});

    const router = useRouter();

    // dispatch để thao tác lên biến SelectedItem (gồm có set và updateSelected)
    const dispatch = useDispatch();


    // biến chung để lưu các id của các sp, dưới dạng mảng các {id:number, selected: boolean}[]
    const SelectedItem = useAppSelector(state => state.selectedItem.value.selected);

    // fetch data
    useEffect(() => {
        axios.get(`${baseUrl}/cart/${1}`).then(res => {
            setListCart(res.data)
        })
    }, [])


    // mỗi khi chọn 1 dòng trên table thì thay đổi lại biến selectedItem chung
    useEffect(() => {
        let temp: any[] = []
        listCart.forEach(product => {
            temp.push(
                {
                    id: product.id,
                    selected: false,
                }
            )
        });
        dispatch(set({ value: { selected: temp } }))
    }, [listCart, dispatch])



    // các cột trong table
    const columns: ColumnDef<CartDetailResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    //@ts-ignore
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => { table.toggleAllPageRowsSelected(!!value) }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => { row.toggleSelected(!!value); dispatch(updateSelected({ id: row.getValue("id"), selected: !!value })) }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        tên
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "imageUrl",
            header: () => <div className="text-center">trạng thái</div>,
            cell: ({ row }) => {
                return <Image src={'https://product.hstatic.net/1000304367/product/olv232239-2_7039b25098644daaba0575828b9458ba_grande.jpg'} width={160} height={120} sizes='2/3' alt='' />
            },
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-center">số lượng</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.getValue("startDate")}
                </div>
            },
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">giá</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.getValue("price")}
                </div>
            },
        },
        {
            id: "hành động",
            enableHiding: false,
            header: () => <div className="text-center">hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">mở menu</span>
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ], [router]);

    const table = useReactTable({
        data: listCart,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="flex mt-32 min-h-[calc(100vh-256px)] px-[14%] pt-6 flex-col gap-6">
            <>
                <p className="uppercase text-2xl font-bold">giỏ hàng của tôi</p>
                <div className="flex-grow flex justify-center">
                    {
                        listCart.length == 0
                            ?
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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
