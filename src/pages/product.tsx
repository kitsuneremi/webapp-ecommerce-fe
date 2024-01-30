'use client'
import CheckTable from "../components/product/Table";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { redirect } from 'next/navigation'
import { uploadBytes, ref } from 'firebase/storage'
import { storage } from "../lib/firebase";
import { v4 as uuid } from 'uuid'
import { useDropzone } from 'react-dropzone'
import axios from "axios";
import { Divider, Input as AntInput, Select as AntSelect, Space, Button as AntButton, Radio, RadioGroupProps, Select, Button, Input, Slider } from 'antd/lib';
import { FaPlus } from "react-icons/fa6";
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useToast } from "@chakra-ui/react";
import { Textarea } from "@/components/ui/textarea"


let index = 0;

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
    },
    {
        Header: "action",
        accessor: "action"
    }
]

export default function ProductPage() {

    const [data, setData] = useState<any[]>([])
    const [listCateGory, setListCategory] = useState<any[]>([])

    const [panel, setPanel] = useState<number>(0);

    // // search sản phẩm
    const [searchValue, setSearchValue] = useState<string>("")
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [searchStatusValue, setSearchStatusValue] = useState<string>("1")

    useEffect(() => {
        if (searchValue.trim().length > 0) {
            axios.get(`http://localhost:8080/api/product/search?keyword=${searchValue}`).then(res => setSearchResult(RemodelData(res.data)))
        } else {

        }
    }, [searchValue, searchStatusValue])

    // // HẾT search sản phẩm

    // // add sản phẩm
    const [addModalNameValue, setAddModalNameValue] = useState<string>("")
    const [addModalDesValue, setAddModalDesValue] = useState<string>("")
    const [addModalCateValue, setAddModalCateValue] = useState<number>(-1)
    const [imageFile, setImageFile] = useState<File>()
    // // màu sắc
    const [selectedColors, setSelectedColors] = useState<any[]>([]);
    const [listColor, setListColor] = useState<string[]>(['blue', 'red']);
    const [filteredColorOptions, setFilteredColorOptions] = useState<string[]>([]);

    useEffect(() => {
        setFilteredColorOptions(listColor.filter((o) => !selectedColors.includes(o)));
    }, [listColor, selectedColors])

    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [listMaterial, setListMaterial] = useState<string[]>(['vải', 'da']);
    const [filteredMaterialOptions, setFilteredMaterialOptions] = useState<string[]>([]);

    useEffect(() => {
        setFilteredMaterialOptions(listMaterial.filter((o) => !selectedMaterials.includes(o)));
    }, [listMaterial, selectedMaterials])

    const [addMoreColor, setAddMoreColor] = useState<string>('');
    const [addMoreMaterial, setAddMoreMaterial] = useState<string>('')
    const addMoreColorInputRef = useRef<HTMLInputElement>(null);
    const addMoreMaterialInputRef = useRef<HTMLInputElement>(null);

    const addColorItem = (e) => {
        e.preventDefault();
        setListColor([...listColor, addMoreColor || `New item ${index++}`]);
        setAddMoreColor('');
        setTimeout(() => {
            // @ts-ignore
            addMoreColorInputRef.current?.focus();
        }, 0);
    };

    const addMaterialItem = (e) => {
        e.preventDefault();
        setListMaterial([...listMaterial, addMoreColor || `New item ${index++}`]);
        setAddMoreColor('');
        setTimeout(() => {
            // @ts-ignore
            addMoreColorInputRef.current?.focus();
        }, 0);
    };

    const [matrix, setMatrix] = useState<any[]>();


    useEffect(() => {
        setMatrix(selectedColors.map((color) => ({
            color: color,
            materials: selectedMaterials.map((mat) => {
                return {
                    material: mat,
                    price: 0,
                    quantity: 0,
                }
            })
        })))
    }, [selectedMaterials, selectedColors])

    const handleInputChange = (index, key, value) => {
        setMatrix((prev) => {
            // @ts-ignore
            const updatedVariants = [...prev];
            updatedVariants[index][key] = value;
            return updatedVariants;
        });
    };

    // // HẾT add sản phẩm


    const toast = useToast();

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

    useEffect(() => {
        const prefetch = async () => {
            const data = await fetch('http://localhost:8080/api/v1/product?page=0&size=5', {
                method: 'GET'
            }).then(res => { return res.json() })
            setData(RemodelData(data))
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

    /**
     * lấy vào mảng data trả từ be và sửa lại để hiện dc trên table
     * @param {Product[]} list 
     * @returns {Table[]}
     */
    const RemodelData = (list) => {
        let temp = [];
        list.map(item => (
            // @ts-ignore
            temp.push({ ...item, id: [item.id, false], imageUrl: { value: item.imageUrl ? item.imageUrl : "", customElement: generateCustomElement(item.imageUrl, <p>missing!</p>, <img src={item.imageUrl} alt="" />) } })
        ))
        return temp;
    }

    const handleAddProduct = () => {
        if (imageFile) {
            toast({
                duration: 3000,
                title: "missing image",
                status: "error",
            })
        } else if (addModalCateValue == -1) {
            toast({
                duration: 3000,
                title: "missing category",
                status: "error",
            })
        } else if (addModalNameValue.trim().length === 0) {
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
                name: addModalNameValue,
                description: addModalDesValue,
                category: addModalCateValue,
                imageUrl: imageUrl
            }
            axios.post('http://localhost:8080/api/v1/product', data).then(
                res => {
                    if (imageFile) {
                        uploadBytes(productImageStorageRef, imageFile);
                    }
                    toast({
                        duration: 3000,
                        title: res.data.title,
                        status: res.data.status,
                    })
                }
            )
        }
    }

    return (
        <DashboardLayout>
            <div className="">
                <div className="w-full flex mb-3 relative after:absolute after:w-full after:bottom-0 after:left-0 after:h-[1px] after:bg-slate-600 after:bg-opacity-35">
                    <button onClick={() => { setPanel(0) }} className={`px-5 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 0 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        Danh sách sản phẩm
                    </button>
                    <button onClick={() => { setPanel(1) }} className={`px-3 py-3 text-sm font-semibold h-full bg-slate-100 ${panel === 1 ? 'bg-slate-200 text-cyan-500 relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-cyan-500' : ''}`}>
                        Thêm sản phẩm
                    </button>
                </div>
                {panel == 0 &&
                    <div className="px-6">
                        <div className="mb-5">
                            <div>
                                <div className="flex gap-3 bg-slate-100">
                                    <Input placeholder="keyword" value={searchValue} onChange={e => { setSearchValue(e.target.value) }} />
                                    <Button onClick={() => { setPanel(1) }}>Thêm sản phẩm</Button>
                                </div>
                                {/* tìm kiếm theo giá, chất liệu, ... */}
                                <div className="grid grid-cols-3 grid-flow-row gap-3 px-3">
                                    <div>
                                        <p>trạng thái</p>
                                        <Radio.Group onChange={e => setSearchStatusValue(e.target.value)} value={searchStatusValue}>
                                            <Radio value='1'>Đang bán</Radio>
                                            <Radio value='2'>đã ngừng</Radio>
                                            <Radio value='3'>abc</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div>
                                        <p>Phân loại</p>
                                        <Select placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <p>Nhãn Hàng</p>
                                        <Select placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <p>Chất liệu</p>
                                        <Select placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <p>Kích cỡ</p>
                                        <Select placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <p>Khoảng giá</p>
                                        <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} />;
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CheckTable columnsData={columnData} tableData={searchResult.length > 0 && searchValue.trim().length > 0 ? searchResult : data} />
                    </div>
                }

                {
                    panel == 1 &&
                    <div className="px-6">
                        <p>Thông tin cơ bản</p>
                        <div className="w-full flex flex-col gap-3">
                            <div className="flex flex-col gap-3">
                                <p>tên sản phẩm</p>
                                <input className="w-full text-xl border-[1px] p-2 border-slate-400 focus:outline-none focus:border-cyan-500 rounded-3xl" type="text" value={addModalNameValue} onChange={e => { setAddModalNameValue(e.target.value) }} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="font-bold">upload ảnh</p>
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
                                <p>des</p>
                                <Textarea
                                    value={addModalDesValue}
                                    onChange={e => { setAddModalDesValue(e.target.value) }}
                                    placeholder='Here is a sample placeholder'
                                />
                            </div>
                        </div>


                        <p>thông tin chi tiết</p>
                        <div>
                            <div className="flex flex-col gap-2">
                                <p>category</p>
                                <Select placeholder='Select option' defaultValue={-1} onChange={e => { setAddModalCateValue(e) }}>
                                    {listCateGory.map((cate, index) => {
                                        return (
                                            <option key={index} value={cate.id}>{cate.name}</option>
                                        )
                                    })}
                                    <option value={-1} onClick={() => { redirect('/category/add') }}>add new</option>
                                </Select>
                            </div>
                        </div>

                        <p>Thông tin bán hàng</p>
                        <div className="grid grid-cols-2 gap-4 p-6 bg-white">
                            <div>
                                <p>Màu sắc</p>
                                <AntSelect
                                    className="w-full"
                                    // style={{ width:  }}
                                    placeholder="custom dropdown render"
                                    mode="multiple"
                                    value={selectedColors}
                                    onChange={setSelectedColors}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <AntInput
                                                    placeholder="Please enter item"
                                                    // @ts-ignore
                                                    ref={addMoreColorInputRef}
                                                    value={addMoreColor}
                                                    onChange={e => { setAddMoreColor(e.target.value) }}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                                <AntButton type="text" icon={<FaPlus />} onClick={addColorItem}>
                                                    Add color
                                                </AntButton>
                                            </Space>
                                        </>
                                    )}
                                    options={filteredColorOptions.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />
                            </div>
                            <div>
                                <p>Chất liệu</p>
                                <AntSelect
                                    className="w-full"
                                    // style={{ width:  }}
                                    placeholder="custom dropdown render"
                                    mode="multiple"
                                    value={selectedMaterials}
                                    onChange={setSelectedMaterials}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <AntInput
                                                    placeholder="Please enter item"
                                                    //@ts-ignore
                                                    ref={addMoreMaterialInputRef}
                                                    value={addMoreMaterial}
                                                    onChange={e => { setAddMoreMaterial(e.target.value) }}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                                <AntButton type="text" icon={<FaPlus />} onClick={addMaterialItem}>
                                                    Add item
                                                </AntButton>
                                            </Space>
                                        </>
                                    )}
                                    options={filteredMaterialOptions.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th>Color</th>
                                        <th>Material</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {
                                        matrix && matrix.map((row, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center h-8">{row.color}</td>
                                                    <td>
                                                        {row.materials.map((value, index) => {
                                                            return (
                                                                <p key={index} className="text-center h-8">{value.material}</p>
                                                            )
                                                        })}
                                                    </td>
                                                    <td>
                                                        {row.materials.map((value, index) => {
                                                            return (
                                                                <p key={index} className="text-center h-8">{value.price}</p>
                                                            )
                                                        })}
                                                    </td>
                                                    <td>
                                                        {row.materials.map((value, index) => {
                                                            return (
                                                                <p key={index} className="text-center h-8">{value.quantity}</p>
                                                            )
                                                        })}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </DashboardLayout>
    )
}


function generateCustomElement(request, falseRes, trueRes) {
    if (request) {
        return trueRes
    } else {
        return falseRes
    }
}