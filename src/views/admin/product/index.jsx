import CheckTable from "./components/ProductCheckTable";
import React from "react";
import {
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
    Select
} from '@chakra-ui/react'
import { useEffect, useState, useCallback } from "react";
import { Redirect } from 'react-router-dom'
import { uploadBytes, ref } from 'firebase/storage'
import { storage } from "lib/firebase";
import { v4 as uuid } from 'uuid'
import { useDropzone } from 'react-dropzone'

const columnData = [
    {
        Header: "id",
        accessor: "id"
    },
    {
        Header: "name",
        accessor: "name"
    },
    {
        Header: "category",
        accessor: "category"
    },
    {
        Header: "imageUrl",
        accessor: "imageUrl"
    },
    {
        Header: "description",
        accessor: "description"
    }
]

export default function ProductPage() {

    const [data, setData] = useState([])
    const [listCateGory, setListCategory] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [addModalNameValue, setAddModalNameValue] = useState("")
    const [addModalDesValue, setAddModalDesValue] = useState("")
    const [addModalCateValue, setAddModalCateValue] = useState(-1)
    const [imageFile, setImageFile] = useState()

    const onDrop = useCallback(acceptedFiles => {
        setImageFile(acceptedFiles[0])
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    useEffect(() => {
        const prefetch = async () => {
            const data = await fetch('http://localhost:8080/api/v1/product?page=0&size=5', {
                method: 'GET'
            }).then(res => { return res.json() })
            const checkData = []
            data.map(item => (
                checkData.push({ ...item, id: [item.id, false], imageUrl: { value: item.imageUrl ? item.imageUrl : "https://facebook.com/kitsuneremii/asdhashdoah", customElement: generateCustomElement(item.imageUrl, <p>missing!</p>, <img src={item.imageUrl} alt="" />) } })
            ))
            console.log(checkData)
            setData(checkData)
        }
        prefetch();
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

    const handleAddProduct = () => {
        if (imageFile) {
            const imageUrl = `/product/image/${uuid()}`
            const productImageStorageRef = ref(storage, imageUrl)
            uploadBytes(productImageStorageRef, imageFile)

            const data = {
                id: 0,
                name: addModalNameValue,
                description: addModalDesValue,
                category: addModalCateValue,
                imageUrl: imageUrl
            }

            fetch('http://localhost:8080/api/v1/product', {
                method: 'POST'
            }, data)
        }


    }

    return (
        <div className="mt-20">
            <div className="">
                <Button onClick={onOpen}>Open Modal</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="w-full flex flex-col gap-3">
                                <div className="flex flex-col gap-3">
                                    <p>name</p>
                                    <input className="w-full text-xl border-[1px] p-2 border-slate-400 focus:outline-none focus:border-cyan-500 rounded-3xl" type="text" value={addModalNameValue} onChange={e => { setAddModalNameValue(e.target.value) }} />
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
                                    <Select placeholder='Select option' defaultValue={0}>
                                        {listCateGory.map((cate, index) => {
                                            return (
                                                <option value={cate.id}>{cate.name}</option>
                                            )
                                        })}
                                        <option onClick={() => { Redirect('/category/add') }}>add new</option>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p>des</p>
                                    <Textarea
                                        value={addModalDesValue}
                                        onChange={e => { setAddModalDesValue(e.target.value) }}
                                        placeholder='Here is a sample placeholder'
                                        size='sm'
                                        resize={'vertical'}
                                    />
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>Close </Button>
                            <Button variant='ghost' onClick={() => { handleAddProduct() }}>Save</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
            {data.length > 0 && <CheckTable columnsData={columnData} tableData={data} />}
        </div>
    )
}


function generateCustomElement(request, falseRes, trueRes) {
    if (request) {
        return trueRes
    } else {
        return falseRes
    }
}