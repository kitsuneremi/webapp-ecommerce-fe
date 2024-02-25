'use client'
import React, { useEffect, useState, useCallback, useRef } from "react";
import { redirect, useParams } from 'next/navigation'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage'
import { storage } from "../../lib/firebase";
import { v4 as uuid } from 'uuid'
import { useDropzone } from 'react-dropzone'
import axios from "axios";
import { Divider, Input as AntInput, Select as AntSelect, Space, Button as AntButton, Radio, RadioGroupProps, Select, Button, Input, Slider, ColorPicker, InputNumber } from 'antd/lib';
import { FaPlus } from "react-icons/fa6";
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { useToast } from "@chakra-ui/react";
import { Textarea } from "@/components/ui/textarea"
import { makeid } from "../../lib/functional";
import { BrandResponse, CategoryResponse, ColorResponse, MaterialResponse, ProductResponse, SizeResponse, StyleResponse } from "../../lib/type";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox"
import Barcode from "react-barcode";


export default function ProductPage(props) {

    const [data, setData] = useState<ProductResponse>()

    const [imageFile, setImageFile] = useState<File>()

    const [selectedProductDetail, setSelectedProductDetail] = useState<number[]>([]);

    // màu sắc
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [listColor, setListColor] = useState<ColorResponse[]>([]);
    const [addMoreColor, setAddMoreColor] = useState<string>('#1677ff');
    const [filteredColorOptions, setFilteredColorOptions] = useState<ColorResponse[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/color').then(res => {
            setListColor(res.data);
        })
    }, [])

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
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
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

    //style
    const [selectedStyle, setSelectedStyle] = useState<StyleResponse>();
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
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>();
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
    const [selectedMaterials, setSelectedMaterials] = useState<MaterialResponse>();
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
    const [selectedBrand, setSelectedBrand] = useState<BrandResponse>();
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

    const [matrix, setMatrix] = useState<any[]>([]);

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

    const ChangeMatrixChecked = ({ targetCol, targetRow, value }: { value: string | boolean, targetCol: number, targetRow: number }) => {
        setMatrix(prev => {
            const newMatrix = prev.map(row => ({ ...row }));
            newMatrix[targetCol].sizes[targetRow].checked = value;
            return newMatrix;
        });
    }

    useEffect(() => {
        if (selectedSizes.length > 0 && selectedColors.length > 0) {
            const updatedMatrix = selectedColors.map(color => ({
                color: color,
                sizes: selectedSizes.map(size => {
                    const productDetail = data.lstProductDetails.find(detail => detail.color.id.toString() == color && detail.size.id.toString() == size);
                    return {
                        size: size,
                        checked: false,
                        barcode: productDetail ? productDetail.barcode : makeid(),
                        id: productDetail ? productDetail.id : -1,
                        price: productDetail ? productDetail.price : 0,
                        quantity: productDetail ? productDetail.quantity : 0,
                    };
                })
            }));
            setMatrix(updatedMatrix);
        }
    }, [selectedSizes, selectedColors, data]);


    // // HẾT add sản phẩm


    const toast = useToast();
    const params = useParams();

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
        if (params) {
            axios.get(`http://localhost:8080/api/v1/product/${params.id}`).then(res => {
                setData(res.data);
                const sizeIds: string[] = Array.from(new Set(res.data.lstProductDetails.map(detail => detail.size.id)));
                const colorIds: string[] = Array.from(new Set(res.data.lstProductDetails.map(detail => detail.color.id)));
                setSelectedSizes(sizeIds);
                setSelectedColors(colorIds);

                setSelectedBrand(res.data.brand)
                setSelectedCategory(res.data.category)
                setSelectedMaterials(res.data.material)
                setSelectedStyle(res.data.style)
            })
        }
    }, [params])

    const handleUpdateProduct = () => {
        if (!imageFile && !data.imageUrl) {
            toast({
                duration: 3000,
                title: "missing image",
                status: "error",
            })
        } else if (data.name.trim().length === 0) {
            toast({
                duration: 3000,
                title: "missing name",
                status: "error",
            })
        } else {
            if (imageFile) {

            }
            const imageUrl = imageFile ? `/product/image/${uuid()}` : data.imageUrl;
            const productImageStorageRef = ref(storage, imageUrl);

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
            const q = {
                id: data.id,
                code: makeid(),
                name: data.name,
                material: selectedMaterials.id,
                style: selectedStyle.id,
                brand: selectedBrand.id,
                description: data.description,
                category: selectedCategory.id,
                imageUrl: imageUrl,
                lstProductDetails: temp
            }


            axios.put(`http://localhost:8080/api/v1/product/${data.id}`, q).then(
                res => {
                    if (imageFile) {
                        uploadBytes(productImageStorageRef, imageFile);
                    };

                    toast({
                        duration: 3000,
                        title: res.data.title,
                        status: res.data.status,
                    })
                }
            )
        }
    }

    const handleExportBarcode = () => {
        let checked = [];
        matrix.map(a => {
            a.sizes.map(value => {
                if (value.checked == true) {
                    checked.push(value.id);
                }
            })
        })
        if(checked.length > 0){
            axios.get(`http://localhost:8080/api/v1/product/barcode?data=${checked.toString()}`)
        }else{
            let t = data.lstProductDetails.map(val => {return val.id});
            axios.get(`http://localhost:8080/api/v1/product/barcode?data=${t.toString()}`)
        }
        
    }

    return (
        <DashboardLayout>
            <div className="h-fit overflow-auto">
                <div className="px-3 flex flex-col gap-3">
                    <div className="p-3 bg-slate-200 shadow-lg">
                        <p className="text-slate-600 font-semibold">Thông tin cơ bản</p>
                        <div className="flex gap-5">
                            <div className="w-1/2 flex flex-col gap-3">
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm mb-1 font-semibold text-slate-600">tên sản phẩm</p>
                                    {data ? <input className="w-full text-sm border-[1px] px-2 py-1 border-slate-400 focus:outline-none focus:border-cyan-500 rounded-3xl" placeholder="nhập tên đại diện sản phẩm" type="text" value={data.name} onChange={e => { setData(prev => { return { ...prev, name: e.target.value } }) }} />
                                        : <Skeleton className="w-full h-7" />}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm mb-1 font-semibold text-slate-600">mô tả chi tiết</p>
                                    {data ? <Textarea
                                        value={data.description}
                                        onChange={e => { setData(prev => { return { ...prev, description: e.target.value } }) }}
                                        placeholder='điền mô tả sản phẩm tại đây'
                                    /> : <Skeleton className="w-full h-24" />}
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-3">
                                <p className="text-sm mb-1 font-semibold text-slate-600">upload ảnh</p>
                                <div className="flex h-36 items-center rounded-lg justify-center border-[1px] border-dashed border-slate-500" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <p className="text-sm text-slate-600">Thả</p> :
                                            data && data.imageUrl ? <GenImage path={data.imageUrl} /> : <p className="text-sm text-slate-600">bấm để chọn hoặc kéo thả ảnh vào đây</p>
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

                            q   QQ
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
                            <button className="my-2 px-2 py-1 rounded-md bg-green-600 text-white font-bold text-md" onClick={() => { handleExportBarcode() }}>tải xuống mã vạch</button>
                            <table className="w-full border-collapse table-border">
                                <thead>
                                    <tr className="table-border">
                                        <th className="table-border">#</th>
                                        <th className="table-border">Color</th>
                                        <th className="table-border">ID</th>
                                        <th className="table-border">barcode</th>
                                        <th className="table-border">Size</th>
                                        <th className="table-border">Price</th>
                                        <th className="table-border">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matrix && matrix.map((row, rowIndex) => (
                                        row.sizes.map((value, sizeIndex) => (
                                            <tr className="table-border" key={`${rowIndex}-${sizeIndex}`}>
                                                <td className=""><Checkbox className="" value={value.checked} onCheckedChange={value => { ChangeMatrixChecked({ value, targetRow: sizeIndex, targetCol: rowIndex }) }} /></td>
                                                {sizeIndex === 0 && (
                                                    <th className="table-border" rowSpan={row.sizes.length}>{row.color}</th>
                                                )}
                                                <th className="table-border">{value.id}</th>
                                                <th className="table-border"><Barcode value={value.barcode} /></th>
                                                <th className="table-border">{value.size}</th>
                                                <td className="table-border">
                                                    <InputNumber min={1000} defaultValue={1000} suffix="d" className="w-full" value={value ? value.price : 1} onChange={(e) => ChangeMatrixPrice({ value: e, targetRow: sizeIndex, targetCol: rowIndex })} />
                                                </td>
                                                <td className="table-border">
                                                    <InputNumber min={1} max={10000} value={value ? value.quantity : 1} className="w-full" onChange={(e) => ChangeMatrixQuantity({ value: e.toString(), targetRow: sizeIndex, targetCol: rowIndex })} />
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>




                            {
                                matrix.length == 0 && <div className="w-full h-72"></div>
                            }
                        </div>
                    </div>



                    <button onClick={handleUpdateProduct} className="mb-6 px-5 py-2 bg-cyan-500 text-slate-800 rounded-md font-semibold">Cập nhật sản phẩm</button>
                </div>
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


function GenImage({ path }: { path: string }) {
    const avatarRef = ref(storage, path);
    const [link, setLink] = useState<string>();

    useEffect(() => {
        getDownloadURL(avatarRef).then(url => setLink(url)).catch(e => {
            setLink('https://file.lyart.pro.vn/api/image?path=-1')
        })
    }, [avatarRef])

    if (link) {
        return <img src={link} className="h-full aspect-auto" />
    }
}