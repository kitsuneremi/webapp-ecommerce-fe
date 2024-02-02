export interface BillResponse {
    id: number,
    codeBill: string,
    status: string,
    bookingDate: Date,
    paymentDate: Date,
    DeliveryDate: Date,
    completionDate: Date,
    receiverName: string,
    receiverPhone: string,
    receiverAddress: string,
    CustomerResponse: CustomerResponse,
}

export type CustomerResponse = {
    id: number,
    codeCustomer: string,
    fullName: string,
    birthday: Date,
    gender: boolean,
    address: string,
    phone: string,
    email: string,
    username: string,
    password: string,
}


export interface BillRequest {
    id: number,
    codeBill: string,
    status: string,
    bookingDate: Date,
    paymentDate: Date,
    DeliveryDate: Date,
    completionDate: Date,
    receiverName: string,
    receiverPhone: string,
    receiverAddress: string,
    customer: number;
}

export type ProductResponse = {
    id: number,
    imageUrl: string,
    name: string,
    category: number,
    description: string,
}

export type CartDetailResponse = {
    id: number,
    cart: number,
    quantity: number,
    productDetails: ProductDetailResponse,
}

export type ProductDetailResponse = {
    id: number,
    code: string,
    imageUrl: string,
    price: number,
    quantity: number,
    barcode: string,
    status: number,
    product: ProductResponse,
    // AttributesValuesResponse attributesValues;
}

export type VoucherResponse = {
    id: number,
    code_voucher: string,
    name: string,
    value: number,
    quantity: number,
    startDate: Date,
    endDate: Date
}

export type VoucherDetailResponse = {
    id: number,
    customer: CustomerResponse,
    voucher: VoucherResponse,
    bill: BillResponse,
    status: number,
    usedDate: Date
}


export interface StaffResponse {
    id: number,
    code: string,
    full_name: string,
    birthday: Date,
    gender: number,
    address: string,
    email: string,
    phone: string,
    imageUrl: string
}