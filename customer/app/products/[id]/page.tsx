'use client'

import Image from 'next/image'
import { Select, Space, Rate} from 'antd';
import type { SelectProps } from 'antd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { FaCartShopping } from "react-icons/fa6";
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { baseUrl } from '@/lib/utils';
import axios from 'axios';

const options: SelectProps['options'] = [];

for (let i = 20; i < 36; i++) {
    options.push({
        label: i,
        value: i,
    });
}

const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
};


export default function Page() {

  const params = useParams();
  useEffect(() => {
    axios.get(`${baseUrl}/products/${params.id}`)
  },[params])

    return (
        <main className='flex flex-col min-h-[calc(100vh-128px)] mt-32 justify-between py-24 px-[14%] gap-24'>
            <div className='w-full flex gap-5 max-md:flex-col'>
                <div className='w-1/2 max-md:w-full flex flex-col gap-3'>
                    <div className='w-full aspect-[2/3] relative'>
                        <Image fill alt='' src={"https://product.hstatic.net/1000304367/product/dsc05399-2_ab4567ea0eeb4c46a3e75f3ebdaf0490_master.jpg"} />
                    </div>
                    <Carousel className=''>
                        <CarouselContent className=' -ml-4'>
                            <CarouselItem className="basis-1/4 pl-4 w-fit">
                                <div className='w-16 aspect-[2/3] relative cursor-pointer'>
                                    <Image src={'https://product.hstatic.net/1000304367/product/dsc05399-2_ab4567ea0eeb4c46a3e75f3ebdaf0490_master.jpg'} alt={""} fill />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="basis-1/4 pl-4 w-fit">
                                <div className='w-16 aspect-[2/3] relative cursor-pointer'>
                                    <Image src={'https://product.hstatic.net/1000304367/product/dsc05399-2_ab4567ea0eeb4c46a3e75f3ebdaf0490_master.jpg'} alt={""} fill />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="basis-1/4 pl-4 w-fit">
                                <div className='w-16 aspect-[2/3] relative cursor-pointer'>
                                    <Image src={'https://product.hstatic.net/1000304367/product/dsc05399-2_ab4567ea0eeb4c46a3e75f3ebdaf0490_master.jpg'} alt={""} fill />
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </div>
                <div className='flex-grow flex flex-col gap-3'>
                    <p className='text-3xl text-slate-700 '>Váy Blake Long Sleev Top</p>
                    <p className='text-lg'>490,000d</p>
                    <Select
                        mode="multiple"
                        allowClear
                        className='w-1/2'
                        placeholder="hãy chọn kích cỡ"
                        defaultValue={[]}
                        onChange={handleChange}
                        options={options}
                    />

                    <div className='flex gap-3'>
                        <button className='px-3 py-2 bg-blue-600 text-slate-100 uppercase font-semibold rounded-sm'>Mua ngay</button>
                        <button className='px-3 py-2 bg-yellow-500 text-slate-50 uppercase font-semibold rounded-sm'>Thêm vào giỏ hàng</button>
                    </div>
                    <Tabs defaultValue="service" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="service">Dịch vụ</TabsTrigger>
                            <TabsTrigger value="about">Về sản phẩm</TabsTrigger>
                            <TabsTrigger value="protect">Cách bảo quản</TabsTrigger>
                        </TabsList>
                        <TabsContent value="service">
                            <div className='flex flex-col gap-2'>
                                <p className='text-sm text-slate-500'>Giao hàng trên toàn quốc</p>
                                <p className='text-sm text-slate-500'>- MIỄN PHÍ GIAO HÀNG cho đơn hàng từ 1,000,000 vnđ</p>
                                <p className='text-sm text-slate-500'>- Áp dụng cho mọi đơn hàng tại website OLV.VN</p>
                                <p className='text-sm text-slate-500'>Đổi/Trả dễ dàng trong 3 ngày</p>
                                <p className='text-sm text-slate-500'>Xem thêm tại CHÍNH SÁCH ĐỔI TRẢ</p>
                                <p className='text-sm text-slate-500'>Muốn chỉnh sửa sản phẩm cho phù hợp sở thích của bạn?</p>
                                <p className='text-sm text-slate-500'>Xem thêm tại DỊCH VỤ CHỈNH SỬA QUẦN ÁO của OLV nhé!</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="about">
                            <div className='flex flex-col gap-2'>
                                <p>THÔNG TIN SẢN PHẨM</p>
                                <p className='text-sm text-slate-500'>- Chất liệu: Voan hoa</p>
                                <p className='text-sm text-slate-500'>- Có lót bên trong</p>
                                <p className='text-sm text-slate-500'>- Mô tả chất liệu: Thoáng mát, dày vừa phải, dễ giặt ủi</p>
                                <p className='text-sm text-slate-500'>- Đặc điểm: Không mút ngực</p>
                                <p className='text-sm text-slate-500'>- Họa tiết: trơn</p>
                                <p className='text-sm text-slate-500'>THÔNG SỐ SẢN PHẨM (ĐVT: CM)</p>
                                <p className='text-sm text-slate-500'>- Độ Dài: 50cm</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="protect">
                            <div className='flex flex-col gap-2'>
                                <img src='https://file.hstatic.net/1000304367/file/z4099192960317_cea0ae63e333e8bef3fae4b7ffbe26c9_b5cafe7d448f49b78bc7ca60b0ed5d0a.jpg'></img>
                                <p className='text-sm text-slate-500'>- Giặt máy ở nhiệt độ tối đa 30°C, giặt bên trong túi giặt và vắt ở tốc độ thấp để sản phẩm được bảo vệ tốt hơn.</p>
                                <p className='text-sm text-slate-500'>- Đối với các sản phẩm có đính kết, thêu tay đặc biệt của OLV, không giặt máy, luôn giặt tay.</p>
                                <p className='text-sm text-slate-500'>- Không sử dụng nước tẩy, thuốc tẩy, bột giặt có chất tẩy mạnh. Không giặt chung sản phẩm màu trắng với các sản phẩm khác màu tránh tình trạng loang màu.</p>
                                <p className='text-sm text-slate-500'>- Sử dụng máy sấy ở nhiệt độ thấp, chế độ nhẹ.</p>
                                <p className='text-sm text-slate-500'>- Phơi ngay sau khi giặt giúp sản phẩm đỡ nhăn, phơi mặt trái ở bóng râm giúp sản phẩm lưu giữ màu tốt hơn.</p>
                                <p className='text-sm text-slate-500'>- Là sản phẩm ở nhiệt độ thấp (dưới 110°C), ưu tiên dùng bàn là hơi nước.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div>
                <p>Khách hàng đánh giá</p>
                <div className='bg-slate-400 bg-opacity-40 py-6 px-[10%] flex'>
                    <div className='w-1/2'>
                        <p>0 lượt đánh giá</p>
                        <Rate disabled></Rate> 
                    </div>
                    <div className='flex-grow flex flex-col gap-3'>
                        <p>Hàng có vừa không?</p>
                        <div className='flex items-center gap-2'>
                            <p>nhỏ</p>
                            <Progress value={33} />
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>vừa</p>
                            <Progress value={66} />
                        </div>
                    </div>
                </div>
            </div>

            {CarouselBox({title: 'sản phẩm khác'})}
        </main>
    )
}


const CarouselBox = ({ title }: { title: string }) => {
    const Item = () => {
      return (
        <div className="">
          <div className="relative w-full aspect-[2/3]">
            <Image className="" src={'https://ae01.alicdn.com/kf/S9a61b504f25944d18d2d0aeab6d7c7e13.jpg_640x640Q90.jpg_.webp'} alt="" fill />
            <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 font-bold text-xs text-white">còn hàng</div>
            <div className="absolute top-2 right-2 ">
              <FaCartShopping />
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
            <div className="absolute bottom-0 left-0 w-full h-10 bg-slate-300 bg-opacity-65 flex items-center justify-center">
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
      <div className="flex flex-col gap-10 w-full">
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