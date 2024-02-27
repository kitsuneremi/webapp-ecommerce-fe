"use client"
import { Tag } from 'antd/lib'
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

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { ProductDetailResponse, ProductResponse, PromotionResponse, Selected } from "../../lib/type"
import Link, { redirect, useRouter } from 'next/navigation'
import axios from "axios"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useAppSelector } from '../../redux/storage'
import { set, updateSelected, toggleChildren } from '../../redux/features/promotion-selected-item'
import { useDispatch } from "react-redux";

export default function ListTable({ data }: { data: ProductResponse[] }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [open, setOpen] = useState({});
    const dispatch = useDispatch();

    const selectedProduct = useAppSelector((state) => state.promotionReducer.value.selected)

    useEffect(() => {
        let temp: Selected[] = []
        data.forEach(product => {
            temp.push(
                {
                    id: product.id,
                    selected: false,
                    children: product.lstProductDetails.map(proDetail => {
                        return {
                            id: proDetail.id,
                            selected: false
                        }
                    })
                }
            )
        });
        dispatch(set({ value: { selected: temp } }))
    }, [data, dispatch])

    // useEffect(() => {
    //     let temp: Selected[] = []
    //     selectedProduct.map(value => {
    //         temp.push({
    //             id: value.id,
    //             selected: !!rowSelection[value.id],
    //             children: !!rowSelection[value.id] == false ? value.children : value.children.map(child => {
    //                 return {
    //                     id: child.id,
    //                     selected: true
    //                 }
    //             })
    //         })
    //     })
    //     dispatch(set({ value: { selected: temp } }))
    // }, [dispatch, rowSelection])

    const handleToggleOpen = (id) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [id]: !prevOpen[id] // Nếu đã mở thì đóng, và ngược lại
        }));
    };

    const columns: ColumnDef<ProductResponse>[] = useMemo(() => [
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
                    checked={row.getIsSelected() || (selectedProduct.find(value => {
                        return value.id == row.getValue("id")
                    })?.selected)}
                    onCheckedChange={(value) => { row.toggleSelected(!!value); dispatch(updateSelected({ id: row.getValue("id"), selected: !!value })) }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "accordion",
            header: () => <div className="text-center">acr</div>,
            cell: ({ row }) => (
                // @ts-ignore
                <div onClick={() => handleToggleOpen(row.getValue("id"))}>{!!open[row.getValue("id")] ? <FaAngleUp /> : <FaAngleDown />}</div>
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
            accessorKey: "status",
            header: () => <div className="text-center">trạng thái</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.getValue("status") == 0 ? row.getValue("endDate") > new Date() ? <Tag color={"red"}>
                    ĐÃ KẾT THÚC
                </Tag> : <Tag color={"blue"}>
                    ĐANG DIỄN RA
                </Tag> : <Tag color={"yellow"}>
                    ĐANG TẠM NGƯNG
                </Tag>}</div>
            },
        },
        {
            accessorKey: "lstProductDetails",
            enableHiding: true,
            header: () => <div className="text-center">sl biến thể</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {/* @ts-ignore */}
                    {row.getValue("lstProductDetails").length}
                </div>
            },
        },
    ], [dispatch, open, selectedProduct]);

    const table = useReactTable({
        data,
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
                                    <>
                                        <TableRow data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        <TableRow data-state={row.getIsSelected() && "selected"}>
                                            {/* @ts-ignore */}
                                            {open[row.getValue("id")] && <TableCell colSpan={columns.length}><ProductDetailTable targetDataId={row.getValue("id")} selected={row.getIsSelected()} belowData={row.getValue("lstProductDetails")}></ProductDetailTable></TableCell>}
                                        </TableRow>
                                    </>
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
        </>
    )
}



const ProductDetailTable = ({ belowData, selected, targetDataId }: { targetDataId: number, belowData: ProductDetailResponse[], selected: boolean }) => {
    const [belowSorting, setBelowSorting] = useState<SortingState>([])
    const [belowColumnFilters, setBelowColumnFilters] = useState<ColumnFiltersState>([])
    const [belowColumnVisibility, setBelowColumnVisibility] = useState<VisibilityState>({})
    const [belowRowSelection, setBelowRowSelection] = useState({})

    const selectedProduct = useAppSelector((state) => state.promotionReducer.value.selected)

    const dispatch = useDispatch();

    const belowColumns: ColumnDef<ProductDetailResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div></div>
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {row.toggleSelected(!!value); dispatch(toggleChildren({id: row.getValue("id"), parentId: targetDataId, value: !!value}))}}
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
            accessorKey: "size",
            header: ({ column }) => {
                return (
                    <div className='text-center'>Kích cỡ</div>
                )
            },
            // @ts-ignore
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("size").name}</div>,
        },
        {
            accessorKey: "color",
            header: () => <div className="text-center">màu sắc</div>,
            cell: ({ row }) => {
                // @ts-ignore
                return <div className="text-center font-medium">{row.getValue("color").name}</div>
            },
        },
        {
            accessorKey: "imageUrl",
            header: () => <div className="text-center">img</div>,
            cell: ({ row }) => {
                return <div className="text-center flex justify-center font-medium max-h-16">
                    {/* @ts-ignore */}
                    <img className="h-full aspect-auto" src={row.getValue("imageUrl")} />
                </div>
            },
        }
    ], []);

    const belowTable = useReactTable({
        data: belowData,
        columns: belowColumns,
        onSortingChange: setBelowSorting,
        onColumnFiltersChange: setBelowColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setBelowColumnVisibility,
        onRowSelectionChange: setBelowRowSelection,
        state: {
            sorting: belowSorting,
            columnFilters: belowColumnFilters,
            columnVisibility: belowColumnVisibility,
            rowSelection: belowRowSelection,
        },
    })

    useEffect(() => {
        belowTable.toggleAllRowsSelected(selected);
    }, [belowTable, selected])

    return (
        <>
            <div className="mr-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {belowTable.getHeaderGroups().map((headerGroup) => (
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
                            {belowTable.getRowModel().rows?.length ? (
                                belowTable.getRowModel().rows.map((row) => (
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
                                        colSpan={belowColumns.length}
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
                        {belowTable.getFilteredSelectedRowModel().rows.length} of{" "}
                        {belowTable.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => belowTable.previousPage()}
                            disabled={!belowTable.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => belowTable.nextPage()}
                            disabled={!belowTable.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}