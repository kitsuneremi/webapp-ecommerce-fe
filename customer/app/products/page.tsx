'use client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Col, InputNumber, Row, Slider, Space } from 'antd';
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";


export default function ProductPage() {

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000000);

    const onChange = (newValue: number[]) => {
        setMinPrice(newValue[0])
        setMaxPrice(newValue[1])
    };


    return (
        <main className="flex bg-white justify-between mt-32 py-5">
            <div className="flex flex-col gap-2 justify-start overflow-y-scroll h-[calc(100vh-256px)]">
                <div className="flex flex-col px-4 w-[220px] gap-2">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger><p className="font-bold">bộ sưu tập</p></AccordionTrigger>
                            <AccordionContent>
                                <p className="text-slate-500">váy hoa</p>
                                <p className="text-slate-500">váy maxi</p>
                                <p className="text-slate-500">váy thêu</p>
                                <p className="text-slate-500">váy abc</p>
                                <p className="text-slate-500">váy hoa</p>
                                <p className="text-slate-500">váy hoa</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger><p className="font-bold">mức giá</p></AccordionTrigger>
                            <AccordionContent>
                                <div className="px-2">
                                    <div className="flex items-center">
                                        <p>min</p>
                                        <InputNumber
                                            min={0}
                                            className="flex-grow"
                                            style={{ margin: '0 16px' }}
                                            value={minPrice}
                                            onChange={(value: number | null) => { if (value) setMinPrice(value) }}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <p>max</p>
                                        <InputNumber
                                            min={0}
                                            className="flex-grow"
                                            style={{ margin: '0 16px' }}
                                            value={maxPrice}
                                            onChange={(value: number | null) => { if (value) setMaxPrice(value) }}
                                        />
                                    </div>
                                    <Slider
                                        range
                                        min={0}
                                        max={20000000}
                                        onChange={onChange}
                                        value={[minPrice, maxPrice]}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Đang sale</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="onSale" />
                                    <Label htmlFor="onSale">Đang sale</Label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Nhãn hàng</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="nsx0" />
                                        <Label htmlFor="nsx0">Hãng abc</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="nsx1" />
                                        <Label htmlFor="nsx1">Hãng def</Label>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>màu sắc</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex gap-2">
                                    <div className="flex flex-col gap-2">
                                        <input type="checkbox" id="custom-checkbox-0" className="hidden" />
                                        <label htmlFor="custom-checkbox-0" className="custom-checkbox bg-red-600 w-8 h-8 after:w-4 after:h-4"></label>
                                        <Label className="text-center font-semibold">đỏ</Label>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input type="checkbox" id="custom-checkbox-1" className="hidden" />
                                        <label htmlFor="custom-checkbox-1" className="custom-checkbox bg-blue-600 w-8 h-8 after:w-4 after:h-4"></label>
                                        <Label className="text-center font-semibold">xanh</Label>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input type="checkbox" id="custom-checkbox-1" className="hidden" />
                                        <label htmlFor="custom-checkbox-1" className="custom-checkbox bg-yellow-600 w-8 h-8 after:w-4 after:h-4"></label>
                                        <Label className="text-center font-semibold">vàng</Label>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <div className="flex-grow grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-col-2 gap-3 px-4 overflow-y-scroll">
                <div className="flex flex-col gap-3">
                    <div className="w-full aspect-[4/5] relative group">
                        <Image src={"https://product.hstatic.net/1000304367/product/dsc02666-2_31fdcea83d6e4e5a97262d07698d2ac1_master.jpg"} alt="i" fill />
                        <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 font-bold text-xs text-white">còn hàng</div>
                        <div className="absolute top-2 right-2 cursor-pointer p-3 hidden rounded-full bg-slate-500 hover:bg-rose-200 group-hover:block">
                            <FaCartShopping />
                        </div>
                        <div className="absolute hidden group-hover:flex bottom-0 left-0 w-full h-10 bg-slate-300 bg-opacity-65 items-center justify-center">
                            <p className="text-xl uppercase">Xem nhanh</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-lg font-bold">váy abc</p>
                        <p className="text-slate-500 text-sx">1 màu sắc</p>
                        <p className="text-slate-500 text-sm">2,190,000d - 2,390,000d</p>
                    </div>
                </div>



                {Array.from([1, 2, 3, 4, 5]).map((val, index) => {
                    return (
                        <div className="flex flex-col gap-3">
                            <div className="w-full aspect-[4/5] relative group">
                                <Image src={"https://product.hstatic.net/1000304367/product/dsc02666-2_31fdcea83d6e4e5a97262d07698d2ac1_master.jpg"} alt="i" fill />
                                <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 font-bold text-xs text-white">còn hàng</div>
                                <div className="absolute top-2 right-2 cursor-pointer p-3 hidden rounded-full bg-slate-500 hover:bg-rose-200 group-hover:block">
                                    <FaCartShopping />
                                </div>
                                <div className="absolute hidden group-hover:flex bottom-0 left-0 w-full h-10 bg-slate-300 bg-opacity-65 items-center justify-center">
                                    <p className="text-xl uppercase">Xem nhanh</p>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <p className="text-lg font-bold">váy abc</p>
                                <p className="text-slate-500 text-sx">1 màu sắc</p>
                                <p className="text-slate-500 text-sm">2,190,000d - 2,390,000d</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}