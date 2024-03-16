'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../lib/functional';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import ListTable from '../../components/promotion/listTable'
import { ProductResponse, PromotionResponse } from '../../lib/type';
import ReduxProvider from '../../redux/provider'

const PromotionPage = (): JSX.Element => {
    const [data, setData] = useState<PromotionResponse[]>([]);
    

    useEffect(() => {
        axios.get(`${baseUrl}/promotion`).then(res => {
            setData(res.data);
            // dispatch(set({value: {selected: }}))
            console.log(res.data.lstPromotionDetails)
        })
    }, [])



    return (
        <DashboardLayout>
            <div className="p-6">
                <p>Sự kiện giảm giá</p>
                <button onClick={() => { redirect('/promotion/add') }} className={`px-3 py-3 text-sm font-semibold bg-slate-100 `}>
                    Thêm đợt giảm giá mới
                </button>
                <div>
                    <div className='mt-5'>
                        <ListTable data={data} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

const Layout = (props) => {
    return (
        <ReduxProvider><PromotionPage></PromotionPage></ReduxProvider>
    )
}

export default Layout