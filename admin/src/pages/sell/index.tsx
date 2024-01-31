import { useState, useEffect } from "react"
import * as React from "react";
import axios from 'axios'
import { BillRequest, BillResponse, ProductResponse, ProductDetailResponse, CartDetailResponse, CustomerResponse, VoucherDetailResponse, VoucherResponse } from "../../lib/type";
import { vnData } from '../../lib/extra'
import { FaRegTrashAlt, FaChevronRight } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { TbBrandCashapp } from "react-icons/tb";
import { Radio, Tag, Button, Input, Form, Select, Slider } from 'antd/lib'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import {
    Select as ShaSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { baseUrl } from "../../lib/functional";


type FieldType = {
    fullName?: string;
    phone?: string;
    email?: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
};


export default function SellPage() {

    const [currentPanel, setCurrentPanel] = useState<number>(0);
    // màn danh sách hóa đơn
    const [billType, setBillType] = useState<string>("0"); // -1 là hủy, 0 là đang chờ,1 là đã xác nhận/chờ giao hàng, 2 là đang giao hàng, 3 là chưa thanh toán, 4 là đã hoàn thành, 5 hoàn trả
    const [listDisplayBill, setListDisplayBill] = useState<BillResponse[]>([
        {
            bookingDate: new Date(),
            codeBill: "abcde",
            completionDate: new Date(),
            CustomerResponse: {
                address: "",
                birthday: new Date(),
                codeCustomer: "",
                email: "test@gamil.com",
                fullName: "nguyen van a",
                gender: false,
                id: 10,
                password: "abc",
                phone: "034534234234",
                username: "test"

            },
            DeliveryDate: new Date(),
            id: 1,
            paymentDate: new Date(),
            receiverAddress: "abc",
            receiverName: "name",
            receiverPhone: "023042304234",
            status: "test"
        },
        {
            bookingDate: new Date(),
            codeBill: "defgh",
            completionDate: new Date(),
            CustomerResponse: {
                address: "",
                birthday: new Date(),
                codeCustomer: "",
                email: "test@gamil.com",
                fullName: "hoang van b",
                gender: false,
                id: 10,
                password: "abc",
                phone: "034534234234",
                username: "test"

            },
            DeliveryDate: new Date(),
            id: 1,
            paymentDate: new Date(),
            receiverAddress: "tttt",
            receiverName: "ttt",
            receiverPhone: "012282834234",
            status: "test"
        }
    ]);

    // React.useEffect(() => {
    //     axios.get(`http://localhost:8080/api/v1/bill?type=${billType}&page=0&type=0`).then(res => {
    //         setListDisplayBill(res.data)
    //     })
    // }, [billType])


    // hết màn danh sách hóa đơn



    // danh sách sp trong bill đang dc sửa

    const [currentBillSelected, setCurrentBillSelected] = useState<BillResponse>({ //biến xác định xem hóa đơn nào đang được lựa chọn để sửa
        bookingDate: new Date(),
        codeBill: "abcde",
        completionDate: new Date(),
        CustomerResponse: {
            address: "",
            birthday: new Date(),
            codeCustomer: "",
            email: "test@gamil.com",
            fullName: "nguyen van a",
            gender: false,
            id: 10,
            password: "abc",
            phone: "034534234234",
            username: "test"

        },
        DeliveryDate: new Date(),
        id: 1,
        paymentDate: new Date(),
        receiverAddress: "abc",
        receiverName: "name",
        receiverPhone: "023042304234",
        status: "test"
    });

    const [listCart, setListCart] = useState<CartDetailResponse[]>([{ // biến chứa thông tin các sản phẩm đang có trong bill hiện tại
        cart: 1,
        id: 1,
        productDetails: {
            barcode: "",
            code: "",
            id: 1,
            imageUrl: "",
            price: 10000,
            product: {
                category: 0,
                description: "des",
                id: 10,
                name: "vay asndasdklas",
                imageUrl: ""
            },
            quantity: 100,
            status: 0
        },
        quantity: 20
    }]);

    // HẾT danh sách sp trong bill đang dc sửa

    // search sản phẩm
    const [searchValue, setSearchValue] = useState<string>("")
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [searchStatusValue, setSearchStatusValue] = useState<string>("1")

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


    React.useEffect(() => {
        const province = vnData.find(target => { return target.code == addModalProvince });
        const t = province.districts;
        setListDistricts(t)
        setAddModalDistrict(t[0].code)
    }, [addModalProvince])

    React.useEffect(() => {
        if (addModalDistrict && listDistricts.length > 0) {
            const t = listDistricts.find(target => { return target.code == addModalDistrict }).wards;
            setListWards(t)
            setAddModalWard(t[0].code)
        }
    }, [addModalDistrict, listDistricts])

    React.useEffect(() => {
        if (searchCustomerValue.trim().length > 0) {
            axios.get(`http://localhost:8080/api/v1/customer?keyword=${searchCustomerValue}`).then(res => {
                setListSearchCustomer(res.data)
            })
        }
    }, [searchCustomerValue])


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
                <div className="flex"><p>{"["}{voucher.code_voucher}{"] "}</p><p>{voucher.name}</p><Tag>{voucher.value}</Tag></div>
            </div>
        )
    }

    // HẾT voucher

    const handleCreateEmptyBill = () => {
        const data: BillRequest = {
            id: -1,
            codeBill: "-1",
            status: "string",
            bookingDate: new Date(),
            paymentDate: null,
            DeliveryDate: null,
            completionDate: null,
            receiverName: null,
            customer: -1,
            receiverAddress: "",
            receiverPhone: ""
        }

        axios.post(`http://localhost:8080/api/v1/bill`, data).then(
            res => {
                setCurrentPanel(1);
                setCurrentBillSelected(res.data);
            }
        )

    }

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
                                    <div className=" px-4">
                                        <p className="text-slate-600 font-semibold mb-3">trạng thái hóa đơn</p>
                                        {/* <RadioGroup onChange={setBillType} value={billType}>
                                        <div className="w-full flex gap-2 overflow-x-auto">
                                            <Radio value={"-1"}>Hủy</Radio>
                                            <Radio value={"0"}>Chờ xác nhận</Radio>
                                            <Radio value={"1"}>Đã xác nhận</Radio>
                                            <Radio value={"2"}>Đang giao hàng</Radio>
                                            <Radio value={"3"}>Chưa thanh toán</Radio>
                                            <Radio value={"4"}>Đã hoàn thành</Radio>
                                            <Radio value={"5"}>Hoàn trả</Radio>
                                        </div>
                                    </RadioGroup> */}
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
                                                                        <TableCell>{bill.codeBill}</TableCell>
                                                                        <TableCell>{bill.CustomerResponse.fullName}</TableCell>
                                                                        <TableCell>{bill.bookingDate.toISOString()}</TableCell>
                                                                        <TableCell>{bill.CustomerResponse.phone}</TableCell>
                                                                        <TableCell>{bill.id}</TableCell>
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
                                                    <p>đơn hàng {currentBillSelected.codeBill}</p>
                                                    <div className="flex gap-2">
                                                        {/* Thêm danh sách sản phẩm */}
                                                        <Dialog>
                                                            <DialogTrigger>Thêm sản phẩm</DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Thêm sản phẩm vào danh sách</DialogTitle>
                                                                    <DialogDescription>
                                                                        <div className="mb-5">
                                                                            <div>
                                                                                <div className="flex gap-3 bg-slate-100">
                                                                                    <Input placeholder="keyword" value={searchValue} onChange={e => { setSearchValue(e.target.value) }} />
                                                                                    <Button onClick={() => {}}>Tìm kiếm</Button>
                                                                                </div>
                                                                                {/* tìm kiếm theo giá, chất liệu, ... */}
                                                                                <div className="grid grid-cols-3 grid-flow-row gap-3 px-3">
                                                                                    <div>
                                                                                        <p>trạng thái</p>
                                                                                        <Radio.Group onChange={e => setSearchStatusValue(e.target.value)} value={searchStatusValue}>
                                                                                            <Radio value='1'>Đang bán</Radio>
                                                                                            <Radio value='2'>đã ngừng</Radio>
                                                                                            <Radio value='3'>abc</Radio>
                                                                                        </Radio.Group>
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
                                                                        </div>
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>
                                                        {/* HẾT thêm danh sách sản phẩm */}
                                                    </div>
                                                </div>

                                                {/* danh sách sản phẩm trong giỏ ở đây */}
                                                <div className="border-[1px] border-slate-500 border-opacity-35 p-2 shadow-xl">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableCell>STT</TableCell>
                                                                <TableCell>Sản phẩm</TableCell>
                                                                <TableCell>Số lượng</TableCell>
                                                                <TableCell>Thành tiền</TableCell>
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
                                                                        listCart.map((cart, index) => {
                                                                            return (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{index + 1}</TableCell>
                                                                                    <TableCell>
                                                                                        <div className="flex gap-2">
                                                                                            <img className="w-28 aspect-square" src="https://th.bing.com/th/id/OIP.gau_s0CHzCxhnpvuIU4LaAHaHa?rs=1&pid=ImgDetMain" alt="" />
                                                                                            <div className="flex flex-col gap-2">
                                                                                                <p className="text-xl font-bold">{cart.productDetails.product.name}</p>
                                                                                                <p className="text-xs text-slate-600 font-semibold">{cart.productDetails.product.description}</p>
                                                                                                <p>đơn giá: {cart.productDetails.price}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {/* <NumberInput defaultValue={cart.quantity} min={1} max={cart.productDetails.quantity}>
                                                                                            <NumberInputField />
                                                                                            <NumberInputStepper>
                                                                                                <NumberIncrementStepper />
                                                                                                <NumberDecrementStepper />
                                                                                            </NumberInputStepper>
                                                                                        </NumberInput> */}
                                                                                    </TableCell>
                                                                                    <TableCell>{cart.quantity * cart.productDetails.price}</TableCell>
                                                                                    <TableCell>
                                                                                        <div className="w-full h-full flex items-center justify-center text-red-600 text-2xl" onClick={() => { }}>
                                                                                            <FaRegTrashAlt />
                                                                                        </div>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        }
                                                                        )
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                {/* HẾT danh sách sản phẩm trong giỏ */}

                                                {/* thông tin khách hàng */}
                                                <div className="border-[1px] border-slate-500 border-opacity-35 p-2 shadow-lg">
                                                    <div className="flex justify-between">
                                                        <p className="text-xl font-bold">Thông tin khách hàng</p>

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


                                                                                    <div className="flex justify-end"><Button className="bg-cyan-600 font-bold text-slate-100" htmlType="submit">Submit</Button></div>
                                                                                </Form>
                                                                            </TabsContent>
                                                                        </Tabs>
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>

                                                    {/* hiển thị thông tin khách hàng đã chọn/thêm */}
                                                    {/* <div className="flex flex-col">
                                                    <p>Tên khách hàng {currentCustomer.fullName}</p>
                                                    <p>Email: {currentCustomer.email ? currentCustomer.email : 'không có'}</p>
                                                    <p>Số điện thoại {currentCustomer.phone}</p>
                                                </div> */}

                                                </div>
                                                {/* HẾT thông tin khách hàng */}

                                                {/* thông tin thanh toán */}
                                                <div className="border-[1px] border-slate-500 border-opacity-35 p-2 shadow-lg">
                                                    <p className="text-xl font-bold">Thông tin thanh toán</p>
                                                    <div className="flex max-md:flex-col gap-3 mt-3 p-2">
                                                        <div className="w-1/2 max-md:w-full flex items-center">
                                                            <img src="https://th.bing.com/th/id/OIP.gau_s0CHzCxhnpvuIU4LaAHaHa?rs=1&pid=ImgDetMain" alt="i" className="w-full aspect-square" />
                                                        </div>
                                                        <div className="w-1/2 max-md:w-full">
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
}