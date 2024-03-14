import { useState, useEffect, useMemo } from "react"
import axios from 'axios'
import { CustomerResponse, VoucherResponse } from "../../lib/type";
import { vnData } from '../../lib/extra'
import { FaRegTrashAlt, FaChevronRight } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { TbBrandCashapp } from "react-icons/tb";
import { Radio, Tag, Input, Form, Select, Slider } from 'antd/lib'
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { baseUrl, makeid } from "../../lib/functional";
import { Bill } from "@prisma/client";
import ProductTable from '../../components/sell/productTabel'
import ValProvider from "../../redux/provider";
import { useAppSelector } from '../../redux/storage'
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import { SelectedProductDetail } from '../../lib/type'
import { Button } from "@/components/ui/button"

type FieldType = {
    fullName?: string;
    phone?: string;
    email?: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
};


function SellPage() {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [currentPanel, setCurrentPanel] = useState<number>(0);

    // màn danh sách hóa đơn
    const [emptyBill, setEmptyBill] = useState<Bill[]>([]);
    const [billType, setBillType] = useState<string>("0"); // -1 là hủy, 0 là đang chờ,1 là đã xác nhận/chờ giao hàng, 2 là đang giao hàng, 3 là chưa thanh toán, 4 là đã hoàn thành, 5 hoàn trả
    const [listDisplayBill, setListDisplayBill] = useState<Bill[]>([]);

    const [currentBillSelected, setCurrentBillSelected] = useState<Bill>() //biến xác định xem hóa đơn nào đang được lựa chọn để sửa);

    // search sản phẩm
    const [searchValue, setSearchValue] = useState<string>("")
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [searchStatusValue, setSearchStatusValue] = useState<string>("1")

    const selectedDetailProduct = useAppSelector(state => state.SellReducer.value.selected);

    useEffect(() => {
        axios.get(`/api/bill`).then(res => {
            setListDisplayBill(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get('/api/bill/empty').then(res => {
            setEmptyBill(res.data);
        })
    }, [])

    useEffect(() => {
        if (searchValue.trim().length > 0) {
            axios.get(`${baseUrl}/product/search?keyword=${searchValue}`).then(res => setSearchResult(res.data))
        } else {

        }
    }, [searchValue, searchStatusValue])

    // thông tin khách hàng
    const [addModalPhone, setAddModalPhone] = useState<string>("");
    const [addModalDetailAddress, setAddModalDetailAddress] = useState<string>("");
    const [addModalProvince, setAddModalProvince] = useState<number>(1);
    const [addModalDistrict, setAddModalDistrict] = useState<number>(1);
    const [addModalWard, setAddModalWard] = useState<number>(1);
    const [addModalFullname, setAddModalFullname] = useState<string>("");
    const [addModalEmail, setAddModalEmail] = useState<string>("");
    const [listDistricts, setListDistricts] = useState<any[]>([]);
    const [listWards, setListWards] = useState<any[]>([]);



    const [searchCustomerValue, setSearchCustomerValue] = useState<string>("");
    const [listSearchCustomerValue, setListSearchCustomer] = useState<CustomerResponse[]>([]);

    const [listCustomer, setListCustomer] = useState<CustomerResponse[]>();
    const [currentCustomer, setCurrentCustomer] = useState<CustomerResponse>();


    useEffect(() => {
        const province = vnData.find(target => { return target.code == addModalProvince });
        if (!province) return;
        const t = province.districts;
        setListDistricts(t)
        setAddModalDistrict(t[0].code)
    }, [addModalProvince])

    useEffect(() => {
        if (addModalDistrict && listDistricts.length > 0) {
            const t = listDistricts.find(target => { return target.code == addModalDistrict }).wards;
            setListWards(t)
            setAddModalWard(t[0].code)
        }
    }, [addModalDistrict, listDistricts])

    useEffect(() => {
        if (searchCustomerValue.trim().length > 0) {
            axios.get(`http://localhost:8080/api/v1/customer?keyword=${searchCustomerValue}`).then(res => {
                setListSearchCustomer(res.data)
            })
        }
    }, [searchCustomerValue])

    useEffect(() => {
        console.log(selectedDetailProduct)
    }, [selectedDetailProduct])


    const CustomerRender = ({ customer }: { customer: CustomerResponse }): JSX.Element => {
        return (
            <div className="flex">
                <img src="https://th.bing.com/th/id/OIP.gau_s0CHzCxhnpvuIU4LaAHaHa?rs=1&pid=ImgDetMain" alt="" className="w-7 aspect-square rounded-full" />
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">{customer.fullName}</p>
                    <p className="text-sm text-slate-600">{customer.phone}</p>
                </div>
            </div>
        )
    }

    // HẾT thông tin khách hàng


    // voucher 
    const [searchVoucherValue, setSearchVoucherValue] = useState<string>('');
    const [voucherFocused, setVoucherFocused] = useState<number>();
    const [listVoucher, setListVoucher] = useState<VoucherResponse[]>([]);

    const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse>();

    // lấy danh sách voucher về
    // React.useEffect(() => {
    //     axios.get('http://localhost:8080/api/v1/voucher').then(res => {
    //         setListVoucher(res.data)
    //     })
    // },[])

    const handleAddVoucher = () => {
        if (searchVoucherValue.trim().length > 0) {
            axios.post('http://localhost:8080/api/v1/addbycutomer', {
                customerId: 0,
                voucherCode: searchVoucherValue
            }).then(res => {
                if (res.status.toString().startsWith("2")) {
                    setListVoucher(prev => { return [...prev, res.data] })
                    setSelectedVoucher(res.data)
                }
            })
        }
    }

    const selectVoucher = () => {
        const x = listVoucher.find(target => {
            return target.id === voucherFocused
        })
        setSelectedVoucher(x)
    }


    const VoucherRender = ({ voucher }: { voucher: VoucherResponse }): JSX.Element => {
        return (
            <div onClick={() => { setVoucherFocused(voucher.id) }} className={`w-full h-20 bg-slate-200 border-[1px] border-slate-500  rounded-lg ${voucherFocused ? '' : ''}`}>
                <div className="flex"><p>{"["}{voucher.code}{"] "}</p><p>{voucher.name}</p><Tag>{voucher.value}</Tag></div>
            </div>
        )
    }

    // HẾT voucher

    const handleCreateEmptyBill = () => {
        axios.post(`/api/v1/bill`).then(
            res => {
                setCurrentPanel(1);
                setCurrentBillSelected(res.data);
            }
        )
    }

    const columns: ColumnDef<SelectedProductDetail>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.detail_id}</div>
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
                {row.original.name}
            </div>
        },
        {
            id: "type",
            header: () => <div className="text-center">phân loại</div>,
            cell: ({ row }) => {
                return <div className='text-center text-nowrap'>
                    {row.original.type}
                </div>
            },
        },
        {
            accessorKey: "buy_quantity",
            header: () => <div className="text-center">số lượng</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.buy_quantity}
                </div>
            },
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">đơn giá</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.price}
                </div>
            },
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">thành tiền</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.buy_quantity * row.original.price}
                </div>
            },
        },
    ], []);

    const table = useReactTable({
        data: selectedDetailProduct,
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
        <DashboardLayout>
            <div className="w-full flex flex-col mb-4">
                <div className="flex w-full items-center justify-between px-3">
                    <p className="text-xl font-bold text-slate-500">Quản lý đơn hàng</p>
                    <button className="px-2 py-1 text-sm font-semibold bg-cyan-500 text-slate-200 rounded-full" onClick={() => { handleCreateEmptyBill() }}>tạo đơn</button>
                </div>
                <div className="flex flex-col flex-grow">
                    <div className="w-full flex mb-3 relative after:absolute after:w-full after:bottom-0 after:left-0 after:h-[1px] after:bg-slate-600 after:bg-opacity-35">
                        <button onClick={() => { setCurrentPanel(0) }} className={`px-5 py-3 text-sm font-semibold h-full bg-slate-100 ${currentPanel === 0 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                            Danh sách hóa đơn
                        </button>
                        <button onClick={() => { setCurrentPanel(1) }} className={`px-3 py-3 text-sm font-semibold h-full bg-slate-100 ${currentPanel === 1 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                            Đơn hàng
                        </button>
                    </div>
                    <div className="flex-grow">
                        {
                            currentPanel == 0 ?
                                <>
                                    <div className="px-4 mb-5">
                                        <p className="text-slate-600 font-semibold mb-3">Hóa đơn chờ</p>
                                        <div className="flex gap-3">
                                            {emptyBill.map((bill, index) => {
                                                return <div onClick={() => { setCurrentBillSelected(bill); setCurrentPanel(1) }} key={index} className="w-28 px-3 py-2 font-semibold bg-slate-500 text-white">
                                                    {bill.code_bill}
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                    <div className="px-4">
                                        <p className="text-slate-600 font-semibold mb-3">Trạng thái hóa đơn</p>
                                        <Radio.Group onChange={e => { setBillType(e.target.value) }} value={billType}>
                                            <Radio value={"-1"}>Hủy</Radio>
                                            <Radio value={0}>Chờ xác nhận</Radio>
                                            <Radio value={1}>Đã xác nhận</Radio>
                                            <Radio value={2}>Đang giao hàng</Radio>
                                            <Radio value={3}>Chưa thanh toán</Radio>
                                            <Radio value={4}>Đã hoàn thành</Radio>
                                            <Radio value={5}>Hoàn trả</Radio>
                                        </Radio.Group>
                                    </div>

                                    <div className="mt-5 p-3">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableCell>Mã hóa đơn</TableCell>
                                                    <TableCell>Tên khách hàng</TableCell>
                                                    <TableCell>Ngày đặt</TableCell>
                                                    <TableCell>Sđt</TableCell>
                                                    <TableCell>Tổng tiền</TableCell>
                                                    <TableCell>Trạng thái</TableCell>
                                                    <TableCell>Hành động</TableCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    !listDisplayBill
                                                        ?
                                                        <Skeleton className="w-full h-12" />
                                                        :
                                                        listDisplayBill.length === 0
                                                            ?
                                                            <div className="w-full flex justify-center text-lg font-bold text-red-600">no value</div>
                                                            :
                                                            listDisplayBill.map((bill, index) => {
                                                                return (
                                                                    <TableRow onClick={() => { setCurrentBillSelected(bill); setCurrentPanel(1) }} key={index}>
                                                                        <TableCell>{bill.code_bill}</TableCell>
                                                                        {/* @ts-ignore */}
                                                                        <TableCell>{bill.Customer.full_name}</TableCell>
                                                                        <TableCell>{bill.booking_date ? bill.booking_date.toString() : ''}</TableCell>
                                                                        {/* @ts-ignore */}
                                                                        <TableCell>{bill.Customer.phone}</TableCell>
                                                                        <TableCell>{bill.total_money?.toString()}</TableCell>
                                                                        <TableCell>{bill.status}</TableCell>
                                                                        <TableCell>
                                                                            <div className="flex gap-2">
                                                                                <div>edit</div>
                                                                                <div>del</div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>

                                :

                                <div className="p-6">
                                    {
                                        !currentBillSelected
                                            ?
                                            <div className="w-full flex justify-center h-full bg-slate-100 items-center">
                                                <button onClick={() => { setCurrentPanel(0) }} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 shadow-lg border-[1px] border-slate-300 border-opacity-20 rounded-full text-2xl font-bold text-purple-500">Chưa có hóa đơn được chọn</button>
                                            </div>
                                            :
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg font-semibold">Đơn hàng {currentBillSelected.code_bill}</p>
                                                    <ProductTable />
                                                </div>

                                                <div className="border-[1px] border-slate-500 border-opacity-35 p-2 shadow-lg">
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

                                                {/* thông tin khách hàng */}
                                                <div className="border-[1px] border-slate-500 border-opacity-35 p-2 shadow-lg">


                                                    {/* hiển thị thông tin khách hàng đã chọn/thêm */}
                                                    <div className="flex flex-col">
                                                        <p>Tên khách hàng: {currentCustomer ? currentCustomer.fullName : ''}</p>
                                                        <p>Email: {currentCustomer && currentCustomer.email ? currentCustomer.email : 'không có'}</p>
                                                        <p>Số điện thoại: {currentCustomer ? currentCustomer.phone : ''}</p>
                                                    </div>

                                                </div>
                                                {/* HẾT thông tin khách hàng */}

                                                {/* thông tin thanh toán */}
                                                <div className="border-[1px] border-slate-500 border-opacity-35 p-2 shadow-lg">
                                                    <div className="flex max-md:flex-col gap-3 mt-3 p-2">

                                                        <div className="w-1/2 max-md:w-full">
                                                            <div className="w-full">
                                                                <p className="text-xl font-bold">Thông tin khách hàng và người nhận</p>
                                                                <Dialog>
                                                                    <DialogTrigger>Thêm</DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Thêm thông tin khách hàng</DialogTitle>
                                                                            <DialogDescription>
                                                                                <Tabs>
                                                                                    <TabsList>
                                                                                        <TabsTrigger value="0">Tìm kiếm</TabsTrigger>
                                                                                        <TabsTrigger value="1">Tạo nhanh</TabsTrigger>
                                                                                    </TabsList>
                                                                                    <TabsContent value="0">
                                                                                        <Input placeholder='nhập thông tin khách hàng' value={searchCustomerValue} onChange={e => { setSearchCustomerValue(e.target.value) }} />

                                                                                        {
                                                                                            listSearchCustomerValue.map((customer, index) => {
                                                                                                return <CustomerRender customer={customer} key={index} />
                                                                                            })
                                                                                        }

                                                                                    </TabsContent>
                                                                                    {/* panel tạo khách hàng */}
                                                                                    <TabsContent value="1">
                                                                                        <Form
                                                                                            name="basic"
                                                                                            labelCol={{ span: 8 }}
                                                                                            wrapperCol={{ span: 16 }}
                                                                                            style={{ maxWidth: 600 }}
                                                                                            initialValues={{ remember: true }}
                                                                                            onFinish={(value) => { console.log(value) }}
                                                                                            // onFinishFailed={onFinishFailed}
                                                                                            autoComplete="off"
                                                                                        >
                                                                                            <Form.Item<FieldType>
                                                                                                label="Họ và tên"
                                                                                                name="fullName"
                                                                                                rules={[{ required: true, message: 'Please input your username!' }]}
                                                                                            >
                                                                                                <Input />
                                                                                            </Form.Item>

                                                                                            <Form.Item<FieldType>
                                                                                                label="Số điện thoại"
                                                                                                name="phone"
                                                                                                rules={[{ required: true, message: 'Please input your password!' }]}
                                                                                            >
                                                                                                <Input />
                                                                                            </Form.Item>
                                                                                            <Form.Item<FieldType>
                                                                                                label="Email"
                                                                                                name="email"
                                                                                                rules={[{ required: true, message: 'Please input your username!' }]}
                                                                                            >
                                                                                                <Input />
                                                                                            </Form.Item>

                                                                                            <Form.Item<FieldType>
                                                                                                label="Province"
                                                                                                name="province"
                                                                                                rules={[{ required: true, message: 'Please input your username!' }]}
                                                                                            >
                                                                                                <Select className="z-[1000]" defaultValue={1} placeholder='Tình/ Thành phố' value={addModalProvince} onChange={value => { setAddModalProvince(value) }}>
                                                                                                    {vnData.map((province) => {
                                                                                                        return <option key={province.code} value={province.code}>{province.name}</option>
                                                                                                    })}
                                                                                                </Select>
                                                                                            </Form.Item>
                                                                                            <Form.Item<FieldType>
                                                                                                label="Quận/Huyện"
                                                                                                name="district"
                                                                                                rules={[{ required: true, message: 'Please input your username!' }]}
                                                                                            >
                                                                                                <Select className="z-[1000]" placeholder='Quận/Huyện' defaultValue={1} value={addModalDistrict} onChange={value => { setAddModalDistrict(value) }}>
                                                                                                    {
                                                                                                        listDistricts.map(district => {
                                                                                                            return <option key={district.code} value={district.code}>{district.name}</option>
                                                                                                        })
                                                                                                    }
                                                                                                </Select>
                                                                                            </Form.Item>
                                                                                            <Form.Item<FieldType>
                                                                                                label="Xã/Thị trấn"
                                                                                                name="ward"
                                                                                                rules={[{ required: true, message: 'Hãy nhập' }]}
                                                                                            >
                                                                                                <Select className="z-[1000]" placeholder='Xã/Thị trấn' defaultValue={1} value={addModalWard} onChange={value => { setAddModalWard(value) }}>
                                                                                                    {
                                                                                                        listWards.map(ward => {
                                                                                                            return <option key={ward.code} value={ward.code}>{ward.name}</option>
                                                                                                        })
                                                                                                    }
                                                                                                </Select>
                                                                                            </Form.Item>

                                                                                            <Form.Item<FieldType>
                                                                                                label="địa chỉ chi tiết"
                                                                                                name="detail"
                                                                                                rules={[{ required: true, message: 'Hãy nhập địa chỉ chi tiết' }]}
                                                                                            >
                                                                                                <Input.TextArea
                                                                                                    value={addModalDetailAddress}
                                                                                                    onChange={e => { setAddModalDetailAddress(e.target.value) }}
                                                                                                    placeholder='Địa chỉ chi tiết'

                                                                                                />
                                                                                            </Form.Item>


                                                                                            <div className="flex justify-end"><Button className="bg-cyan-600 font-bold text-slate-100" type="submit">Submit</Button></div>
                                                                                        </Form>
                                                                                    </TabsContent>
                                                                                </Tabs>
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </div>
                                                        <div className="w-1/2 max-md:w-full">
                                                            <p className="text-xl font-bold">Thông tin thanh toán</p>
                                                            {/* Modal voucher */}
                                                            <div className="flex justify-between items-center">
                                                                <p>Phiếu giảm giá</p>

                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <div className="flex items-center gap-5">
                                                                            <p>Chọn hoặc nhập mã</p>
                                                                            <FaChevronRight />
                                                                        </div>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Áp mã giảm giá</DialogTitle>
                                                                            <DialogDescription>
                                                                                <div className="z-50">
                                                                                    <div className="flex gap-2">
                                                                                        <Input placeholder='nhập mã' value={searchVoucherValue} onChange={e => { setSearchVoucherValue(e.target.value) }} />
                                                                                        <Button onClick={() => { handleAddVoucher() }}>
                                                                                            Thêm
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="min-h-20 w-full flex flex-col gap-2 text-center items-center">
                                                                                        {
                                                                                            listVoucher.length === 0 &&
                                                                                            <p className="font-bold my-2">Không có voucher nào</p>
                                                                                        }
                                                                                        {
                                                                                            selectedVoucher
                                                                                                ?
                                                                                                <>
                                                                                                    <VoucherRender voucher={selectedVoucher} />
                                                                                                    {

                                                                                                        listVoucher.filter(target => {
                                                                                                            return target.id !== selectedVoucher.id
                                                                                                        }).map((voucher, index) => {
                                                                                                            return <VoucherRender voucher={voucher} key={index} />
                                                                                                        })
                                                                                                    }
                                                                                                </>
                                                                                                :
                                                                                                listVoucher.map((voucher, index) => {
                                                                                                    return <VoucherRender voucher={voucher} key={index} />
                                                                                                })
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                            {/* HẾT modal voucher */}

                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <div className="flex justify-between">
                                                                    <p>Tạm tính</p>
                                                                    <p>450.000 đ</p>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <p>Giảm giá</p>
                                                                    <p>{selectedVoucher ? `${selectedVoucher.value} đ` : '0 đ'}</p>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <p>Tổng tiền</p>
                                                                    <p>430.000 đ</p>
                                                                </div>
                                                            </div>
                                                            {/* thanh toán */}
                                                            <div className="flex gap-3 mt-3">
                                                                <div className="w-1/2 py-4 bg-slate-100 hover:bg-slate-200 flex gap-2 items-center justify-center border-[1px] border-slate-500 ">
                                                                    <TbBrandCashapp />
                                                                    <p>tiền mặt</p>
                                                                </div>
                                                                <div className="w-1/2 py-4 bg-slate-100 hover:bg-slate-200 flex gap-2 items-center justify-center border-[1px] border-slate-500 ">
                                                                    <BsBank2 />
                                                                    <p>chuyển khoản</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
};

export default function Layout(props) {
    return <ValProvider>
        <SellPage></SellPage>
    </ValProvider>
}