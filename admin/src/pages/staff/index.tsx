import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from "../../lib/firebase";
import { useDropzone } from 'react-dropzone'
import { Divider, Input as AntInput, Select as AntSelect, Space, Button as AntButton, Radio, RadioGroupProps, Select, Button, Input, Slider, Tag, Table } from 'antd/lib';
import { useToast } from "@chakra-ui/react";
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuid } from 'uuid'
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { StaffResponse } from "../../lib/type";
import type { TableProps } from 'antd/lib';
import Link from 'next/link'


type FieldType = {
    name?: string;
    quantity?: string;
    value?: string;
    // date: [Dayjs, Dayjs],
};



const data: StaffResponse[] = [
    {
        id: 0,
        code: '1',
        full_name: "Furina's bath water",
        address: "adress",
        birthday: new Date(),
        email: 'test@gmail.com',
        gender: 0,
        imageUrl: '',
        phone: '0123456789'
    },
    {
        id: 0,
        code: '5',
        full_name: "kiraaaaa~~",
        address: "adress",
        birthday: new Date(),
        email: 'test@gmail.com',
        gender: 0,
        imageUrl: '',
        phone: '0123456789'
    },
    {
        id: 0,
        code: '3',
        full_name: "moew",
        address: "moew",
        birthday: new Date(),
        email: 'moew@gmail.com',
        gender: 0,
        imageUrl: '',
        phone: '0123456789'
    },
];

const DetailProduct = (props) => {
    const toast = useToast();

    const [listStaff, setListStaff] = useState<StaffResponse[]>([])
    const [imageFile, setImageFile] = useState();

    const onDrop = useCallback(acceptedFiles => {
        setImageFile(acceptedFiles[0])
    }, [])

    const [panel, setPanel] = useState<number>(0);

    const columns: TableProps<StaffResponse>['columns'] = [
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'sinh nhật',
            dataIndex: 'birthday',
            key: 'birthday',
            render: ((_, record) => {
                return <p>{record.birthday.toString()}</p>
            })
        },
        {
            title: 'email',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'email',
            key: 'email',
            dataIndex: 'email'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/staff/${record.id}`}>detail</Link>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    return (

        <>
            <DashboardLayout>
                <div className="w-full h-full flex p-6 flex-col gap-4">
                    <div className="flex gap-5">
                        <Input placeholder="Tìm kiếm nhân viên" />
                    </div>
                    <div className='mt-5'>
                        <Table columns={columns} dataSource={data} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    )
}

export default DetailProduct;
