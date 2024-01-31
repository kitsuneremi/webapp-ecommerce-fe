import { Input, Button, Space, Table, Tag, Form, Checkbox, DatePicker } from 'antd/lib';
import type { TableProps } from 'antd/lib';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { baseUrl } from '../../lib/functional';
import { useToast } from '@/components/ui/use-toast';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';

interface DataType {
    code: string;
    name: string;
    value: number;
    quantity: number,
    description: string;
    startDate: Date;
    endDate: Date;
}

type FieldType = {
    name?: string;
    quantity?: string;
    value?: string;
    date: [Dayjs, Dayjs],
};

const { RangePicker } = DatePicker

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Mã',
        dataIndex: 'code',
        key: 'code',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'giá trị giảm',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'status',
        key: 'endDate',
        dataIndex: 'endDate',
        render: (_, { endDate }) => (
            <>
                {endDate > new Date() ? <Tag color={"red"}>
                    ĐÃ KẾT THÚC
                </Tag> : <Tag color={"blue"}>
                    ĐANG DIỄN RA
                </Tag>}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        code: '1',
        name: "Furina's bath water",
        value: 10,
        quantity: 100,
        description: "32",
        startDate: new Date(),
        endDate: new Date()
    },
    {
        code: '2',
        name: 'aloooo',
        value: 10,
        quantity: 100,
        description: "32",
        startDate: new Date(),
        endDate: new Date()
    },
    {
        code: '3',
        name: 'oke',
        value: 10,
        quantity: 100,
        description: "32",
        startDate: new Date(),
        endDate: new Date()
    },
];

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};




const PromotionPage = (): JSX.Element => {

    const { toast } = useToast();

    const [panel, setPanel] = useState<number>(0);
    const [date, setDate] = useState<[Dayjs, Dayjs]>();

    const handleSubmitForm = (values: any) => {

        if (date) {
            const data = {

            }
            axios.post(`${baseUrl}/promotion`, data).then(res => {
                toast({
                    title: res.data.title,
                    description: res.data.des
                })
            })
        }
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <p>Sự kiện giảm giá</p>
                <div className="w-full flex mb-3 relative after:absolute after:w-full after:bottom-0 after:left-0 after:h-[1px] after:bg-slate-600 after:bg-opacity-35">
                    <button onClick={() => { setPanel(0) }} className={`px-5 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 0 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        Danh sách đợt giảm giá
                    </button>
                    <button onClick={() => { setPanel(1) }} className={`px-3 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 1 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        Thêm đợt giảm giá mới
                    </button>
                </div>
                <div>
                    {panel == 0 &&
                        <>
                            <div className="flex gap-5">
                                <Input placeholder="Basic usage" />
                            </div>
                            <div className='mt-5'>
                                <Table columns={columns} dataSource={data} />
                            </div>
                        </>
                    }
                    {
                        panel == 1 &&
                        <div className='w-full flex justify-center p-5'>
                            <Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true }}
                                onFinish={handleSubmitForm}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item<FieldType>
                                    label="tên chương trình"
                                    name="name"
                                    rules={[{ required: true, message: 'Hãy nhập tên chương trình' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="giá trị giảm"
                                    name="value"
                                    rules={[{ required: true, message: 'Hãy nhập giá trị giảm' }]}
                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item<FieldType>
                                    label="số lượng"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Hãy nhập số lượng' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="ngày bắt đầu - kết thúc"
                                    name="date"
                                    rules={[{ required: true, message: 'Hãy nhập ngày tháng' }]}
                                >
                                    <RangePicker onChange={(val) => { setDate(val) }} showTime />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    }
                </div>
            </div>
        </DashboardLayout>
    )
}


export default PromotionPage