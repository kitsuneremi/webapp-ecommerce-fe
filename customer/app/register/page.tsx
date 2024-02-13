'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
import { redirect, useRouter } from "next/navigation"

export default function RegisterPage() {

    const [mode, setMode] = useState<boolean>(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);


    const { toast } = useToast()

    // const { theme } = useTheme()

    const handleRegister = async () => {

    }

    return (
        <main className="flex min-h-[calc(100vh-128px)] mt-32 justify-between py-24 px-[14%] gap-24">
            <div className="w-1/2 max-md:hidden">
                <p className="text-4xl font-mono uppercase">đăng nhập và đăng ký</p>
            </div>
            <div className="w-full h-full p-8 flex items-center justify-center mt-[-100px]">
                <div className="w-[500px] h-fit p-6 flex flex-col gap-2">
                    <p className="text-2xl text-center mb-7">{mode ? 'Đăng ký tài khoản Alice' : 'Đăng nhập với tài khoản Alice'}</p>
                    <Label>
                        {!mode ? 'Tên đăng nhập hoặc email' : 'Tên đăng nhập'}
                        <Input className="mt-2 bg-slate-100 dark:bg-slate-800" type="text" ref={usernameRef} />
                    </Label>
                    {mode ? <Label>
                        Email
                        <Input className="mt-2 bg-slate-100 dark:bg-slate-800" type="text" ref={emailRef} />
                    </Label> : <></>}

                    <Label>
                        Mật khẩu
                        <Input className="mt-2 bg-slate-100 dark:bg-slate-800" type="password" ref={passwordRef} onKeyDown={e => { if (e.key == 'Enter' && !mode) { handleRegister() } }} />
                    </Label>
                    {mode ? <Label>
                        Nhập lại mật khẩu
                        <Input className="mt-2 bg-slate-100 dark:bg-slate-800 relative outline-none border-none focus:border-0 after:absolute after:w-full after:h-[1px] after:bg-slate-400 after:focus:bg-black after:bottom-0" type="password" ref={confirmPasswordRef} onKeyDown={e => { if (e.key == 'Enter') { handleRegister() } }} />
                    </Label> : <></>}
                    <div className="flex justify-between my-3">
                        <p className="text-sm font-semibold underline cursor-pointer">Quên mật khẩu</p>
                        <p className="text-sm font-semibold underline cursor-pointer" onClick={e => setMode(prev => !prev)}>{!mode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}</p>
                    </div>


                    <div className="w-full mt-3 flex gap-3">
                        <button className={`px-3 py-2 rounded-sm text-xl font-bold bg-emerald-500`} onClick={() => { handleRegister() }}>{!mode ? 'Đăng nhập' : 'Đăng ký'}</button>
                        <button className={`px-3 py-2 rounded-sm text-xl font-bold bg-slate-900 text-white`} onClick={() => { }}>github</button>
                    </div>
                </div>
            </div>
        </main>
    )
}