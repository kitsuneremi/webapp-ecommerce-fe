import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from "lib/firebase";
import { useDropzone } from 'react-dropzone'
import {
    Skeleton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Textarea,
    Select,
    useToast
} from "@chakra-ui/react";
import { v4 as uuid } from 'uuid'
export default function DetailProduct() {
    const location = useLocation();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()

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
        const id = location.pathname.split("/")[3];
        axios.get(`http://localhost:8080/api/v1/product/${id === ":id" ? 1 : id}`).then(res => {
            const imageUrlRef = ref(storage, res.data.imageUrl)
            getDownloadURL(imageUrlRef).then(url => {
                setCurrentProductData({ ...res.data, imageUrl: url })
            })
        })
    }, [])

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
        <div className="w-full h-full pt-14 flex max-md:flex-col gap-4">
            <div className="w-1/2 max-md:w-full aspect-square p-2">
                {currentProductData ? <img className="w-full h-full rounded-xl" src={currentProductData.imageUrl} alt="" /> : <Skeleton className="w-full h-full rounded-xl" />}
            </div>
            <div className="flex flex-col flex-grow gap-3 p-2 mt-5">
                <Button onClick={onOpen}>edit</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
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
                                        <option value={-1} onClick={() => { Redirect('/category/add') }}>add new</option>
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
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>Close </Button>
                            <Button variant='ghost' onClick={() => { handleEditProduct() }}>Save</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

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
    )
}