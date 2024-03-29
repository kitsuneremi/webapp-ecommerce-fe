"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { signIn, useSession } from "next-auth/react"
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransition, useState } from "react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { register } from '@/actions/register'
import { registerSchema } from "@/schema/Schema"
import Link from 'next/link'
export default function Page() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<string>();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            confirmPassword: "",
            email: "",
            password: ""
        },
    });

    const { theme } = useTheme();

    function onSubmit(values: z.infer<typeof registerSchema>) {
        startTransition(async () => {
            const res = await register(values);
            if (res?.error) {
                setError(error)
            } else {
                setSuccess('Thành công, hãy chờ chút')
            }
        })
    }

    return (
        <>
            <p className="text-2xl text-center mb-7">Đăng ký tài khoản Lyart</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="hi3rd@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="hi3rd" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>Mật khẩu</FormLabel>
                            <Input disabled={isPending} className="mt-2 bg-slate-100 dark:bg-slate-800" {...field} type="password" placeholder="hi3rd" autoComplete="current-password" />
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <Input disabled={isPending} className="mt-2 bg-slate-100 dark:bg-slate-800" {...field} type="password" placeholder="hi3rd" autoComplete="confirm-password" />
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Link href={'/login'}><p className="my-3 text-lg font-semibold underline cursor-pointer text-center">Đã có tài khoản? {'->'} đăng nhập ngay</p></Link>
                    <Button className={`w-full text-lg font-semibold ${theme == 'light' ? 'bg-slate-200 text-black' : 'bg-slate-900 text-white'}`} type="submit">Đăng ký</Button>
                </form>
            </Form>
            <div className="w-full mt-3 flex gap-3">
                <button className={`w-1/3 flex justify-center items-center gap-2 h-14 py-2 rounded-sm text-xl font-bold bg-slate-900 text-white`} onClick={() => { signIn("github") }}><FaGithub /> github</button>
                <button className={`w-1/3 flex justify-center items-center gap-2 h-14 py-2 rounded-sm text-xl font-bold bg-slate-900 text-white`} onClick={() => { signIn("google") }}><FcGoogle /> google</button>
            </div>
        </>
    )
}