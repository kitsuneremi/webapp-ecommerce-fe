'use client'
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FaCartShopping } from "react-icons/fa6";
import Autoplay from "embla-carousel-autoplay"

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  )
}


export default function Home() {
  return (
    <main className="flex bg-white flex-col items-center justify-between py-24 gap-24">
      <Carousel opts={
        {
          align: 'start',
          loop: true,
        }
      }
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full">
        <CarouselContent>
          <CarouselItem className="select-none">
            <img src={'https://file.hstatic.net/1000304367/file/cover-party-be-quyen-web-mtinh_19f7650802444ed09cd362f0c8eea377.jpg'} alt="" />
          </CarouselItem>
          <CarouselItem className="select-none">
            <img src={'https://file.hstatic.net/1000304367/file/olv-sale-30_-1402-banner-web-mt_2767d9cccce34c909243cc1d5b35724c.jpg'} alt="" />
          </CarouselItem>
          <CarouselItem className="select-none">
            <img src={'https://file.hstatic.net/1000304367/file/cover-web-mt_de40e9957109427ca763724d6b6444cb.jpg'} alt="" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="px-[14%] flex flex-col gap-24">
        {CarouselBox({ title: 'sản phẩm mới' })}
        {CarouselBox({ title: 'sản phẩm bán chạy' })}

        <div className="flex flex-col gap-10 w-full">
          <div className="flex w-full justify-center text-center">
            <p className="text-4xl uppercase font-bold">Bộ sưu tập</p>
          </div>
          <div className="w-full flex gap-5">
            <div className="w-2/3 aspect-square relative">
              <Image fill alt="" className="" src={'https://theme.hstatic.net/1000304367/1001071053/14/bst_1_1.jpg?v=1064'} />
            </div>
            <div className="flex flex-col gap-5 w-1/3">
              <div className="w-full aspect-[2/3] relative">
                <Image fill alt="" src={'https://theme.hstatic.net/1000304367/1001071053/14/bst_1_2.jpg?v=1064'} />
              </div>
              <div className="w-full aspect-[2/3] relative">
                <Image fill alt="" src={'https://theme.hstatic.net/1000304367/1001071053/14/bst_1_2.jpg?v=1064'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


const CarouselBox = ({ title }: { title: string }) => {
  const Item = () => {
    return (
      <div className="bg-white">
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
