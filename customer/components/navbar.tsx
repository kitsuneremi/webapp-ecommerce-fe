'use client'
import Image from "next/image"
import Link from 'next/link'
import { useState, useRef } from "react"
import { FaCartShopping } from "react-icons/fa6";
export default function Navbar() {



    return (
        <div className="fixed bg-white top-0 w-screen">
            <div className="flex items-center h-24 justify-between w-full px-[14%]">
                <div>
                    <Image src={'https://th.bing.com/th/id/OIP.UaI5w1xjwUf1K7z7wPPqhgHaHa?rs=1&pid=ImgDetMain'} width={80} height={80} sizes="1/1" alt="kira" />
                </div>
                <div className="flex gap-4">
                    <Link href={'/'}>
                        Trang chủ
                    </Link>
                    {B()}
                    <Link href={''}>
                        Chính sách thành viên
                    </Link>
                    <Link href={''}>
                        Cửa hàng
                    </Link>
                </div>
                <div className="flex gap-2 items-center">
                    <Link href={'/register'}>Register</Link>
                    <Link href={'/cart'}>
                        <FaCartShopping />
                    </Link>
                </div>
            </div>
            <div className="flex bg-red-500 h-8 items-center overflow-hidden gap-24">
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
                <p className="text-white font-bold uppercase text-lg animate-marquee">
                    Sale up to 50%
                </p>
            </div>

        </div>
    )
}



const HeaderMenuButton = ({
    children,
    className,
    ...props
}: React.HTMLProps<HTMLDivElement>) => {

    return (
        <div className={`${className} `} {...props}>
            {children}
        </div>
    )
}



const B = () => {

    const [showMenuDropdown, setShowMenuDropdown] = useState<{ menu: boolean, button: boolean }>({ button: false, menu: false })
    const buttonRef = useRef<HTMLButtonElement>();
    const menuRef = useRef<HTMLDivElement>();
    return (
        <>
            <button className={``} onMouseEnter={() => { setTimeout(() => setShowMenuDropdown({ button: true, menu: false }), 200) }} onMouseOut={() => { setTimeout(() => setShowMenuDropdown(prev => { return { button: false, menu: prev.menu } }), 200) }}>Danh mục</button>
            {
                (showMenuDropdown.button || showMenuDropdown.menu) &&
                <div
                    onClick={() => { setShowMenuDropdown({ button: false, menu: true }) }} onMouseOut={() => { setShowMenuDropdown(prev => { return { button: prev.button, menu: false } }) }}
                    className={`absolute w-screen h-[calc(100vh-256px)] top-24 left-0 px-[14%] py-6 bg-rose-100 z-40`}>
                    <div className="w-full h-full grid grid-cols-3 gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-around">
                                <div className="flex flex-col gap-5">
                                    <p className="font-bold">Váy</p>
                                    <p className="text-slate-500">váy hoa</p>
                                    <p className="text-slate-500">váy maxi</p>
                                    <p className="text-slate-500">váy thêu</p>
                                    <p className="text-slate-500">váy abc</p>
                                    <p className="text-slate-500">váy hoa</p>
                                    <p className="text-slate-500">váy hoa</p>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <p className="font-bold">Bộ sưu tập</p>
                                    <p className="text-slate-500">Red edition</p>
                                    <p className="text-slate-500">Day to night</p>
                                    <p className="text-slate-500">Party</p>
                                    <p className="text-slate-500">Night out</p>
                                    <p className="text-slate-500">Date</p>
                                </div>
                            </div>

                        </div>
                        <div className="w-full h-96 relative">
                            <Image fill src={'https://th.bing.com/th/id/OIP.EiMvaAbfV3sUbO3cOj8vAgHaL-?rs=1&pid=ImgDetMain'} alt="" />
                        </div>
                        <div className="w-full h-96 relative">
                            <Image fill src={'https://th.bing.com/th/id/OIP.EiMvaAbfV3sUbO3cOj8vAgHaL-?rs=1&pid=ImgDetMain'} alt="" />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}