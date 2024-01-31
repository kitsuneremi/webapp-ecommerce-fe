'use client'
import Image from "next/image"
import Link from 'next/link'
import { useState, useRef } from "react"
export default function Navbar() {

    

    return (
        <div className="absolute top-0 w-screen h-24 flex items-center justify-around">
            <div>
                <Image src={'https://th.bing.com/th/id/OIP.UaI5w1xjwUf1K7z7wPPqhgHaHa?rs=1&pid=ImgDetMain'} width={80} height={80} sizes="1/1" alt="kira" />
            </div>
            <div className="flex gap-4">
                <Link href={'/'}>
                    Trang chủ
                </Link>
                <div className="">

                </div>
            </div>
            <div>
                right
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
                    className={`absolute w-screen h-[calc(100vh-96px)] top-24 left-0 bg-slate-100`}>
                    <div className="w-full h-full grid grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <p className="font-bold">Váy</p>
                            <p>váy hoa</p>
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