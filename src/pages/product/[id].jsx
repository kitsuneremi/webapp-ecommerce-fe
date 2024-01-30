import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from "lib/firebase";
import { useDropzone } from 'react-dropzone'
import { Divider, Input as AntInput, Select as AntSelect, Space, Button as AntButton, Radio, RadioGroupProps, Select, Button, Input, Slider } from 'antd/lib';
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


export default function DetailProduct() {
    const toast = useToast();
    const router = useRouter();

    const [currentProductData, setCurrentProductData] = useState();
    const [listCateGory, setListCategory] = useState([])
    const [editModalNameValue, setEditModalNameValue] = useState(currentProductData ? currentProductData.name : '')
    const [editModalDesValue, setEditModalDesValue] = useState(currentProductData ? currentProductData.description : '')
    const [editModalCateValue, setEditModalCateValue] = useState(currentProductData ? currentProductData.category : -1)
    const [imageFile, setImageFile] = useState();

    const onDrop = useCallback(acceptedFiles => {
        setImageFile(acceptedFiles[0])
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
    })

    /*
    {
        "id": 1,
        "imageUrl": null,
        "name": "Váy",
        "category": null,
        "description": null
    }
    */

    useEffect(() => {
        if (router) {
            console.log(router)
            const id = router.query.id;
            // axios.get(`http://localhost:8080/api/v1/product/${id === ":id" ? 1 : id}`).then(res => {
            //     const imageUrlRef = ref(storage, res.data.imageUrl)
            //     // getDownloadURL(imageUrlRef).then(url => {
            //     //     setCurrentProductData({ ...res.data, imageUrl: url })
            //     // })
            // })
        }
    }, [router])

    useEffect(() => {
        const prefetch = async () => {
            const data = await fetch('http://localhost:8080/api/v1/category?page=0&size=50', {
                method: 'GET'
            }).then(res => { return res.json() })
            setListCategory(data);
        }
        prefetch();
    }, [])

    const handleEditProduct = () => {
        if (imageFile) {
            toast({
                duration: 3000,
                title: "missing image",
                status: "error",
            })
        } else if (editModalCateValue === -1) {
            toast({
                duration: 3000,
                title: "missing category",
                status: "error",
            })
        } else if (editModalNameValue.trim().length === 0) {
            toast({
                duration: 3000,
                title: "missing name",
                status: "error",
            })
        } else {
            const imageUrl = `/product/image/${uuid()}`
            const productImageStorageRef = ref(storage, imageUrl)


            const data = {
                id: 0,
                name: editModalNameValue,
                description: editModalDesValue,
                category: editModalCateValue,
                imageUrl: imageUrl
            }
            axios.post('http://localhost:8080/api/v1/product', data).then(
                res => {
                    if (!res.status.toString().startsWith("4") && !res.status.toString().startsWith("4")) {
                        uploadBytes(productImageStorageRef, imageFile)
                        toast({
                            duration: 3000,
                            title: "add successfully",
                            status: "success",
                        })
                    } else {
                        toast({
                            duration: 3000,
                            title: "sth wrong, pls check",
                            status: "error",
                        })
                    }
                }
            )
        }
    }

    return (
        <DashboardLayout>
            <div className="w-full h-full flex p-6 max-md:flex-col gap-4">
                <div className="w-1/2 max-md:w-full aspect-square p-2">
                    {currentProductData ? <img className="w-full h-full rounded-xl" src={currentProductData.imageUrl} alt="" /> : <Skeleton className="w-full h-full rounded-xl" />}
                </div>
                <div className="flex flex-col w-1/2 max-md:w-full gap-3 p-2 mt-5">
                    <div className="flex gap-4 justify-end">
                        <Dialog>
                            <DialogTrigger><p className="px-3 py-2 rounded-xl bg-cyan-300">Edit</p></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>update</DialogTitle>
                                    <DialogDescription>
                                        <div className="w-full flex flex-col gap-3">
                                            <div className="flex flex-col gap-3">
                                                <p>name</p>
                                                <input className="w-full text-xl border-[1px] p-2 border-slate-400 focus:outline-none focus:border-cyan-500 rounded-3xl" type="text" value={editModalNameValue} onChange={e => { setEditModalNameValue(e.target.value) }} />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p className="font-bold">upload image</p>
                                                <div className="flex h-24 items-center justify-center border-[1px] border-slate-500" {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    {
                                                        isDragActive ?
                                                            <p>Thả</p> :
                                                            <p>bấm để chọn hoặc kéo thả ảnh vào đây</p>
                                                    }
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <p>category</p>
                                                <Select placeholder='Select option' defaultValue={-1} onChange={e => { setEditModalCateValue(e.target.value) }}>
                                                    {listCateGory.map((cate, index) => {
                                                        return (
                                                            <option key={index} value={cate.id}>{cate.name}</option>
                                                        )
                                                    })}
                                                    <option value={-1} onClick={() => { redirect('/category/add') }}>add new</option>
                                                </Select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p>des</p>
                                                <Textarea
                                                    value={editModalDesValue}
                                                    onChange={e => { setEditModalDesValue(e.target.value) }}
                                                    placeholder='Here is a sample placeholder'
                                                    size='sm'
                                                    resize={'vertical'}
                                                />
                                            </div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger><p className="px-3 py-2 rounded-xl bg-red-600">Delete</p></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <p>name</p>
                            {currentProductData ? <p className="w-full text-xl font-bold">{currentProductData.name}</p> : <Skeleton className="w-full h-7" />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>category</p>
                            {currentProductData ? <p className="w-full text-xl font-bold">{currentProductData.category}</p> : <Skeleton className="w-full h-7" />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>des</p>
                            {currentProductData ? <p className="w-full text-xl font-bold">{currentProductData.description}</p> : <Skeleton className="w-full h-7" />}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}