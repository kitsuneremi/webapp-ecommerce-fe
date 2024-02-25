'use client'
import React, { useEffect, useState, useCallback, useRef } from "react";
import { redirect } from 'next/navigation'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage'
import { storage } from "../lib/firebase";
import { v4 as uuid } from 'uuid'
import { useDropzone } from 'react-dropzone'
import axios from "axios";
import { Divider, Input as AntInput, Select as AntSelect, Space, Button as AntButton, Radio, RadioGroupProps, Select, Button, Input, Slider, ColorPicker, InputNumber } from 'antd/lib';
import { FaPlus } from "react-icons/fa6";
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useToast } from "@chakra-ui/react";
import { Textarea } from "@/components/ui/textarea"
import { makeid } from "../lib/functional";
import { BrandResponse, CategoryResponse, ColorResponse, MaterialResponse, ProductResponse, SizeResponse, StyleResponse } from "../lib/type";
import { DataTableDemo } from "../components/product/Table";

export default function ProductPage(props) {

    const [data, setData] = useState<ProductResponse[]>([])

    const [panel, setPanel] = useState<number>(0);

    // // search sản phẩm
    const [searchValue, setSearchValue] = useState<string>("")
    const [searchResult, setSearchResult] = useState<ProductResponse[]>([])
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
    const [imageFile, setImageFile] = useState<File>()

    // màu sắc
    const [selectedColors, setSelectedColors] = useState<ColorResponse[]>([]);
    const [listColor, setListColor] = useState<ColorResponse[]>([]);
    const [addMoreColor, setAddMoreColor] = useState<string>('#1677ff');
    const [filteredColorOptions, setFilteredColorOptions] = useState<ColorResponse[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/color').then(res => {
            setListColor(res.data);
        })
    }, [])

    useEffect(() => {
        setFilteredColorOptions(listColor.filter((o) => !selectedColors.includes(o)));
    }, [listColor, selectedColors])

    const addColorItem = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/color', {
            name: addMoreColor
        }).then(res => {
            setListColor([...listColor, res.data])
        })
        setAddMoreColor('');
    };

    // size
    const [selectedSizes, setSelectedSizes] = useState<SizeResponse[]>([]);
    const [listSizes, setListSizes] = useState<SizeResponse[]>([]);
    const [addMoreSize, setAddMoreSize] = useState<string>("");
    const [filteredSizesOptions, setFilteredSizesOptions] = useState<SizeResponse[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/size').then(res => {
            setListSizes(res.data);
        })
    }, [])

    const addSizeItem = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/size', {
            name: addMoreSize
        }).then(res => {
            setListSizes([...listSizes, res.data])
        })
        setAddMoreSize('');
    };

    useEffect(() => {
        setFilteredColorOptions(listColor.filter((o) => !selectedColors.includes(o)));
    }, [listColor, selectedColors])


    //style
    const [selectedStyle, setSelectedStyle] = useState<string>();
    const [listStyle, setListStyle] = useState<StyleResponse[]>([])
    const [addMoreStyle, setAddMoreStyle] = useState<string>("");

    const addStyleItem = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/style').then(res => {
            setListStyle(res.data)
        })
    }, [])

    // catergory
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [addMoreCategory, setAddMoreCategory] = useState<string>("");
    const [listCateGory, setListCategory] = useState<CategoryResponse[]>([])

    useEffect(() => {
        const prefetch = async () => {
            const data = await fetch('http://localhost:8080/api/v1/category', {
                method: 'GET'
            }).then(res => { return res.json() })
            setListCategory(data);
        }
        prefetch();
    }, [])

    const addCategoryItem = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/category', {
            name: addMoreCategory
        }).then(res => {
            setListCategory([...listCateGory, res.data]);
        })
        setAddMoreCategory("");
    }

    // material
    const [selectedMaterials, setSelectedMaterials] = useState<string>();
    const [listMaterial, setListMaterial] = useState<MaterialResponse[]>([]);
    const [addMoreMaterial, setAddMoreMaterial] = useState<string>('')
    const [filteredMaterialOptions, setFilteredMaterialOptions] = useState<MaterialResponse[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/material').then(res => {
            setListMaterial(res.data)
        })
    }, [])

    const addMaterialItem = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/material', {
            name: addMoreMaterial
        }).then(res => {
            setListMaterial([...listMaterial, res.data])
        })
        setAddMoreColor('');
        setTimeout(() => {
            // @ts-ignore
            addMoreColorInputRef.current?.focus();
        }, 0);
    };

    // brand
    const [selectedBrand, setSelectedBrand] = useState<string>();
    const [addMoreBrand, setAddMoreBrand] = useState<string>("");
    const [listBrand, setListBrand] = useState<BrandResponse[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/brand').then(res => {
            setListBrand(res.data)
        })
    }, [])

    const addBrandItem = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/brand', {
            name: addMoreBrand
        }).then(res => {
            setListBrand([...listBrand, res.data])
        })
        setAddMoreBrand('');
    }

    const addMoreColorInputRef = useRef<HTMLInputElement>(null);
    const addMoreMaterialInputRef = useRef<HTMLInputElement>(null);

    const [matrix, setMatrix] = useState<any[]>();

    const ChangeMatrixPrice = ({ targetCol, targetRow, value }: { value: string, targetCol: number, targetRow: number }) => {
        setMatrix(prev => {
            const newMatrix = prev.map(row => ({ ...row }));
            newMatrix[targetCol].sizes[targetRow].price = value;
            return newMatrix;
        });
    }
    const ChangeMatrixQuantity = ({ targetCol, targetRow, value }: { value: string, targetCol: number, targetRow: number }) => {
        setMatrix(prev => {
            const newMatrix = prev.map(row => ({ ...row }));
            newMatrix[targetCol].sizes[targetRow].quantity = value;
            return newMatrix;
        });
    }



    useEffect(() => {
        setMatrix(selectedColors.map((color) => ({
            color: color,
            sizes: selectedSizes.map((size) => {
                return {
                    size: size,
                    price: 0,
                    quantity: 0,
                }
            })
        })))
    }, [selectedSizes, selectedColors])

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

    const prefetch = () => {
        axios.get('http://localhost:8080/api/v1/product', {
            method: 'GET'
        }).then(res => { setData(RemodelData(res.data)) })
    }

    useEffect(() => {
        prefetch();
    }, [])


    const RemodelData = (list) => {
        let temp = [];
        list.map(item => (
            // @ts-ignore
            temp.push({ ...item, id: item.id, imageUrl: { value: item.imageUrl ? item.imageUrl : "", customElement: generateCustomElement(item.imageUrl, <p>missing!</p>, <img src={item.imageUrl} alt="" />) } })
        ))
        return temp;
    }

    const handleAddProduct = () => {
        if (!imageFile) {
            toast({
                duration: 3000,
                title: "missing image",
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

            let temp = [];
            matrix.map(row => {
                row.sizes.map((val, index) => {
                    temp.push({
                        code: makeid(),
                        imageUrl: imageUrl,
                        price: val.price,
                        barcode: makeid() + index,
                        color: row.color,
                        size: val.size,
                        quantity: val.quantity
                    })
                })
                console.log(row.sizes);
            });

            if (imageFile) {
                uploadBytes(productImageStorageRef, imageFile).then(res => {
                    getDownloadURL(productImageStorageRef).then(url => {
                        console.log(url)
                        axios.post('http://localhost:8080/api/v1/product', {
                            code: makeid(),
                            name: addModalNameValue,
                            material: selectedMaterials,
                            style: selectedStyle,
                            brand: selectedBrand,
                            description: addModalDesValue,
                            category: selectedCategory,
                            imageUrl: url,
                            lstProductDetails: temp
                        }).then(
                            res => {
                                toast({
                                    duration: 3000,
                                    title: res.data.title,
                                    status: res.data.status,
                                })
                            }
                        )
                    })
                    
                });
            };



        }
    }

    

    return (
        <DashboardLayout>
            <div className="h-fit overflow-auto">
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
                            <div className="mt-5">
                                {/* tìm kiếm theo giá, chất liệu, ... */}
                                <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 grid-flow-row gap-3 px-3">
                                    <div>
                                        <p className="text-sm mb-1 font-semibold text-slate-600">trạng thái</p>
                                        <Radio.Group onChange={e => setSearchStatusValue(e.target.value)} value={searchStatusValue}>
                                            <Radio value='1'>Đang bán</Radio>
                                            <Radio value='2'>đã ngừng</Radio>
                                            <Radio value='3'>abc</Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="my-2">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">Phân loại</p>
                                        <Select className="w-full mt-1" placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="my-2">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">Nhãn Hàng</p>
                                        <Select className="w-full mt-1" placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="my-2">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">Chất liệu</p>
                                        <Select className="w-full mt-1" placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="my-2">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">Kích cỡ</p>
                                        <Select className="w-full mt-1" placeholder='Select option'>
                                            <option value='option1'>Option 1</option>
                                            <option value='option2'>Option 2</option>
                                            <option value='option3'>Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="flex my-2 flex-col justify-between">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">Khoảng giá</p>
                                        <Slider className="w-full mt-1" range={{ draggableTrack: true }} defaultValue={[20, 50]} />
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 my-5 bg-slate-100">
                                <Input placeholder="nhập để tìm kiếm" value={searchValue} onChange={e => { setSearchValue(e.target.value) }} />
                                <Button onClick={() => { setPanel(1) }}>Thêm sản phẩm</Button>
                            </div>
                        </div>

                        {/* {(searchResult.length > 0 && searchValue.trim().length > 0) ? <CheckTable columnsData={columnData} tableData={searchResult} /> : <CheckTable columnsData={columnData} tableData={data} />} */}

                        {/* <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    {columnData.map((column, index) => {
                                        return (
                                            <th scope="col" className="px-6 py-3" key={index}>{column.Header}</th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody className="">
                                {
                                    data.map((row, index) => {
                                        return (
                                            <tr key={index} className="border-b border-slate-400">
                                                <th scope="row" className="text-center px-6 py-4">{row.id}</th>
                                                <td className="text-center px-6 py-4">
                                                    {row.name}
                                                </td>
                                                <td className="text-center px-6 py-4">
                                                    {row.category.name}
                                                </td>
                                                <td className="text-center px-6 py-4">
                                                    <img className="max-w-24 aspect-auto" src={row.imageUrl} />
                                                </td>
                                                <td className="text-center px-6 py-4">
                                                    {row.description}
                                                </td>
                                                <td className="text-center flex justify-center px-6 py-4">
                                                    <div className="flex gap-2 items-center">
                                                        <button className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold" onClick={() => {redirect(`/product/${row.id}`)}}>Sửa</button>
                                                        <button className="px-3 py-1 rounded-md bg-red-600 text-white font-semibold" onClick={() => {axios.delete(`http://localhost:8080/api/v1/product/${row.id}`).then(() => {prefetch()}) }}>Xóa</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table> */}
                        
                        <DataTableDemo data={data} />
                    </div>
                }

                {
                    panel == 1 &&
                    <div className="px-3 flex flex-col gap-3">
                        <div className="p-3 bg-slate-200 shadow-lg">
                            <p className="text-slate-600 font-semibold">Thông tin cơ bản</p>
                            <div className="flex gap-5">
                                <div className="w-1/2 flex flex-col gap-3">
                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">tên sản phẩm</p>
                                        <input className="w-full text-sm border-[1px] px-2 py-1 border-slate-400 focus:outline-none focus:border-cyan-500 rounded-3xl" placeholder="nhập tên đại diện sản phẩm" type="text" value={addModalNameValue} onChange={e => { setAddModalNameValue(e.target.value) }} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm mb-1 font-semibold text-slate-600">mô tả chi tiết</p>
                                        <Textarea
                                            value={addModalDesValue}
                                            onChange={e => { setAddModalDesValue(e.target.value) }}
                                            placeholder='điền mô tả sản phẩm tại đây'
                                        />
                                    </div>
                                </div>
                                <div className="w-1/2 flex flex-col gap-3">
                                    <p className="text-sm mb-1 font-semibold text-slate-600">upload ảnh</p>
                                    <div className="flex h-36 items-center rounded-lg justify-center border-[1px] border-dashed border-slate-500" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {
                                            isDragActive ?
                                                <p className="text-sm text-slate-600">Thả</p> :
                                                imageFile ? <img className="h-full aspect-auto" src={URL.createObjectURL(imageFile)}></img> : <p className="text-sm text-slate-600">bấm để chọn hoặc kéo thả ảnh vào đây</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>







                        <div className="p-3 bg-slate-200 shadow-lg">
                            <p className="text-slate-600 font-semibold">thông tin chi tiết</p>
                            <div className=" grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-2">


                                <div>
                                    <p className="text-sm mb-1 font-semibold text-slate-600">phân loại</p>
                                    <AntSelect
                                        className="w-full"
                                        placeholder="lựa chọn phân loại"
                                        value={selectedCategory}
                                        onChange={setSelectedCategory}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <AntInput
                                                        placeholder="Nhập tên phân loại"
                                                        value={addMoreCategory}
                                                        onChange={e => { setAddMoreCategory(e.target.value) }}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <AntButton type="text" icon={<FaPlus />} onClick={addCategoryItem}>
                                                        Thêm
                                                    </AntButton>
                                                </Space>
                                            </>
                                        )}
                                        options={listCateGory.map((category) => ({
                                            value: category.id,
                                            label: category.name,
                                        }))}
                                    />
                                </div>


                                <div>
                                    <p className="text-sm mb-1 font-semibold text-slate-600">Chất liệu</p>
                                    <AntSelect
                                        className="w-full"
                                        placeholder="lựa chọn chất liệu"
                                        value={selectedMaterials}
                                        onChange={setSelectedMaterials}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <AntInput
                                                        placeholder="Nhập tên chất liệu"
                                                        //@ts-ignore
                                                        ref={addMoreMaterialInputRef}
                                                        value={addMoreMaterial}
                                                        onChange={e => { setAddMoreMaterial(e.target.value) }}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <AntButton type="text" icon={<FaPlus />} onClick={addMaterialItem}>
                                                        Thêm
                                                    </AntButton>
                                                </Space>
                                            </>
                                        )}
                                        options={listMaterial.map((material) => ({
                                            value: material.id,
                                            label: material.name,
                                        }))}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm mb-1 font-semibold text-slate-600">Kiểu dáng</p>
                                    <AntSelect
                                        className="w-full"
                                        placeholder="lựa chọn kiểu dáng"
                                        value={selectedStyle}
                                        onChange={setSelectedStyle}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <AntInput
                                                        placeholder="Nhập tên kiểu dáng"
                                                        value={addMoreStyle}
                                                        onChange={e => { setAddMoreStyle(e.target.value) }}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <AntButton type="text" icon={<FaPlus />} onClick={addStyleItem}>
                                                        Thêm
                                                    </AntButton>
                                                </Space>
                                            </>
                                        )}
                                        options={listStyle.map((style) => ({
                                            value: style.id,
                                            label: style.name,
                                        }))}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm mb-1 font-semibold text-slate-600">Nhãn hàng</p>
                                    <AntSelect
                                        className="w-full"
                                        placeholder="lựa chọn nhãn hàng"
                                        value={selectedBrand}
                                        onChange={setSelectedBrand}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <AntInput
                                                        placeholder="Nhập tên nhãn hàng"
                                                        value={addMoreBrand}
                                                        onChange={e => { setAddMoreBrand(e.target.value) }}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <AntButton type="text" icon={<FaPlus />} onClick={addBrandItem}>
                                                        Thêm
                                                    </AntButton>
                                                </Space>
                                            </>
                                        )}
                                        options={listBrand.map((brand) => ({
                                            value: brand.id,
                                            label: brand.name,
                                        }))}
                                    />
                                </div>

                            </div>
                        </div>






                        <div className="p-3 bg-slate-200 shadow-lg">
                            <p className="text-slate-600 font-semibold">Thông tin bán hàng</p>
                            <div className="grid grid-cols-2 gap-4 pb-6">
                                <div>
                                    <p className="text-sm mb-1 font-semibold text-slate-600">Màu sắc</p>
                                    <AntSelect
                                        className="w-full"
                                        placeholder="lựa chọn các màu sắc"
                                        mode="multiple"
                                        value={selectedColors}
                                        onChange={setSelectedColors}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Space style={{ padding: '0 8px 4px' }}>
                                                    <ColorPicker value={addMoreColor} onChange={e => { setAddMoreColor(e.toHex()) }} showText />
                                                    <AntButton type="text" icon={<FaPlus />} onClick={addColorItem}>
                                                        Thêm
                                                    </AntButton>
                                                </Space>
                                            </>
                                        )}
                                        options={listColor.map((color) => ({
                                            value: color.id,
                                            label: color.name,
                                        }))}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm mb-1 font-semibold text-slate-600">kích cỡ</p>
                                    <AntSelect
                                        className="w-full"
                                        placeholder="lựa chọn các màu sắc"
                                        mode="multiple"
                                        value={selectedSizes}
                                        onChange={setSelectedSizes}
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                            </>
                                        )}
                                        options={listSizes.map((size) => ({
                                            value: size.id,
                                            label: size.name,
                                        }))}
                                    />
                                </div>

                            </div>


                            <div className="w-full">
                                <table className="w-full table-border">
                                    <thead>
                                        <tr className="table-border">
                                            <th className="table-border">màu sắc</th>
                                            <th className="table-border">kích cỡ</th>
                                            <th className="table-border">giá</th>
                                            <th className="table-border">số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {
                                            matrix && matrix.map((row, index) => {
                                                return (
                                                    <tr className="table-border" key={index}>
                                                        <td className="text-center table-border">{row.color}</td>
                                                        <td className="text-center table-border">
                                                            {row.sizes.map((value, index) => {
                                                                return (
                                                                    <p key={index} className="text-center h-8">{value.size}</p>
                                                                )
                                                            })}
                                                        </td>
                                                        <td className="border-r border-slate-500 px-3 py-2">
                                                            {row.sizes.map((value, secondIndex) => {
                                                                return (
                                                                    <InputNumber min={1000} defaultValue={1000} suffix="d" className="w-full" value={value ? value.price : 1000} onChange={(e) => ChangeMatrixPrice({ value: e ? e.toString() : 1000, targetRow: secondIndex, targetCol: index })} key={secondIndex} />
                                                                )
                                                            })}
                                                        </td>
                                                        <td className="w-20 gap-3 px-3 py-2">
                                                            {row.sizes.map((value, secondIndex) => {
                                                                return (
                                                                    <InputNumber min={1} max={10000} defaultValue={1} value={value ? value.quantity : 1} className="w-full" onChange={(e) => ChangeMatrixQuantity({ value: e ? e.toString() : 1, targetRow: secondIndex, targetCol: index })} key={secondIndex} />
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

                        <button onClick={handleAddProduct} className="mb-6 mt-3 px-5 py-2 bg-cyan-500 text-slate-800 rounded-md font-semibold">Thêm sản phẩm</button>
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