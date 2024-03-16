"use client"
import { useState, useEffect, useMemo } from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import { Color, Product, ProductDetail, PromotionDetails, Size } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { Radio, Tag, Form, Select, Slider } from 'antd/lib'
import { useAppSelector } from "../../redux/storage"
import { set, updateSelected, removeSelected } from '../../redux/features/sell-selected-product-detail'
import { useDispatch } from "react-redux"



function ListTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [listProductDetail, setListProductDetail] = useState<ProductDetail[]>([]);

    const selectedProduct = useAppSelector(state => state.SellReducer.value.selected)

    const dispatch = useDispatch();

    useEffect(() => {
        axios.get('/api/product/detail').then(res => {
            setListProductDetail(res.data)
        })
    }, [])

    const columns: ColumnDef<ProductDetail>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    //@ts-ignore
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    // @ts-ignore
                    onCheckedChange={(value) => { row.toggleSelected(!!value),!!value ? dispatch(updateSelected({ id: Number.parseInt(row.original.id.toString()), image: row.original.image_url, name: row.original.Product.name, quantity: row.original.product_id.quantity, buy_quantity: 1, price: row.original.price, type: `[ ${row.original.Color.name + " - " + row.original.Size.name} ]` })) : dispatch(removeSelected({id: Number.parseInt(row.original.id.toString())})) }}
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
            id: "name",
            accessorKey: "Product",
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
            cell: ({ row }) => <div className="lowercase">
                {/* @ts-ignore */}
                {row.original.Product.name}
            </div>
        },
        {
            id: "type",
            header: () => <div className="text-center">phân loại</div>,
            cell: ({ row }) => {
                return <div className='text-center text-nowrap'>
                    {/* @ts-ignore */}
                    {"[ " + row.original.Color.name + " - " + row.original.Size.name + " ]"}
                </div>
            },
        },
        {
            accessorKey: "buy_quantity",
            header: () => <div className="text-center">số lượng</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.quantity}
                </div>
            },
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">đơn giá</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.getValue("price")}
                </div>
            },
        },
    ], [dispatch]);

    const table = useReactTable({
        data: listProductDetail,
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
        <>

            <div className="flex gap-2">
                {/* Thêm danh sách sản phẩm */}
                <Dialog>
                    <DialogTrigger>Thêm sản phẩm</DialogTrigger>
                    <DialogContent className="min-w-max max-h-[80%] overflow-y-scroll">
                        <DialogHeader className="w-max">
                            <DialogTitle>Thêm sản phẩm vào danh sách</DialogTitle>
                            <DialogDescription>
                                <div className="mb-5">
                                    <div>
                                        {/* tìm kiếm theo giá, chất liệu, ... */}
                                        <div className="grid grid-cols-3 grid-flow-row gap-3 px-3">
                                            <div>
                                                <p>trạng thái</p>
                                                {/* <Radio.Group onChange={e => setSearchStatusValue(e.target.value)} value={searchStatusValue}>
                                                    <Radio value='1'>Đang bán</Radio>
                                                    <Radio value='2'>đã ngừng</Radio>
                                                    <Radio value='3'>abc</Radio>
                                                </Radio.Group> */}
                                            </div>
                                            <div>
                                                <p>Phân loại</p>
                                                <Select placeholder='Select option'>
                                                    <option value='option1'>Option 1</option>
                                                    <option value='option2'>Option 2</option>
                                                    <option value='option3'>Option 3</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <p>Nhãn Hàng</p>
                                                <Select placeholder='Select option'>
                                                    <option value='option1'>Option 1</option>
                                                    <option value='option2'>Option 2</option>
                                                    <option value='option3'>Option 3</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <p>Chất liệu</p>
                                                <Select placeholder='Select option'>
                                                    <option value='option1'>Option 1</option>
                                                    <option value='option2'>Option 2</option>
                                                    <option value='option3'>Option 3</option>
                                                </Select>
                                            </div>
                                            <div>
                                                <p>Kích cỡ</p>
                                                <Select placeholder='Select option'>
                                                    <option value='option1'>Option 1</option>
                                                    <option value='option2'>Option 2</option>
                                                    <option value='option3'>Option 3</option>
                                                </Select>
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <p>Khoảng giá</p>
                                                <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} />;
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center py-4">
                                            <Input
                                                placeholder="Filter name..."
                                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                                onChange={(event) =>
                                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                                }
                                                className="max-w-sm"
                                            />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="ml-auto">
                                                        Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {table
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => {
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={column.id}
                                                                    className="capitalize"
                                                                    checked={column.getIsVisible()}
                                                                    onCheckedChange={(value) =>
                                                                        column.toggleVisibility(!!value)
                                                                    }
                                                                >
                                                                    {column.id}
                                                                </DropdownMenuCheckboxItem>
                                                            )
                                                        })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="rounded-md border">
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
                                        </div>
                                        <div className="flex items-center justify-end space-x-2 py-4">
                                            <div className="flex-1 text-sm text-muted-foreground">
                                                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                                {table.getFilteredRowModel().rows.length} row(s) selected.
                                            </div>
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.previousPage()}
                                                    disabled={!table.getCanPreviousPage()}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.nextPage()}
                                                    disabled={!table.getCanNextPage()}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default ListTable