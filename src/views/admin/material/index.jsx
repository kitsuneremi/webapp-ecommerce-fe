import CheckTable from "./components/CategoryCheckTable";
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
    Select,
    useToast,
    Skeleton
} from '@chakra-ui/react'
import { useEffect, useState, useCallback } from "react";
import { Redirect } from 'react-router-dom'
import { uploadBytes, ref } from 'firebase/storage'
import { storage } from "lib/firebase";
import { v4 as uuid } from 'uuid'
import { useDropzone } from 'react-dropzone'
import axios from "axios";

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
        Header: "created by",
        accessor: "createdBy"
    },
    {
        Header: "created at",
        accessor: "createdAt"
    },
    {
        Header: "description",
        accessor: "description"
    }
]

export default function CategoryPage() {

    const [listCateGory, setListCategory] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [addModalNameValue, setAddModalNameValue] = useState("")
    const [addModalDesValue, setAddModalDesValue] = useState("")

    const toast = useToast();

    useEffect(() => {
        const prefetch = async () => {
            const data = await fetch('http://localhost:8080/api/v1/material?page=0&size=50', {
                method: 'GET'
            }).then(res => { return res.json() })
            setListCategory(data);
        }
        prefetch();
    }, [])

    const handleAddCategory = () => {
        if (addModalNameValue.trim().length === 0) {
            toast({
                duration: 3000,
                title: "missing name",
                status: "error",
            })
        } else {
            const data = {
                id: 0,
                name: addModalNameValue,
                description: addModalDesValue,
            }
            axios.post('http://localhost:8080/api/v1/material', data).then(
                res => {
                    if (!res.status.toString().startsWith("4") && !res.status.toString().startsWith("5")) {

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
                            <Button variant='ghost' onClick={() => { handleAddCategory() }}>Save</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
            {listCateGory.length > 0 ? <CheckTable columnsData={columnData} tableData={listCateGory} /> : <Skeleton className="w-full h-52 rounded-xl"/>}
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