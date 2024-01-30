import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, { useMemo } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

export default function CheckTable(props) {
    const { columnsData, tableData } = props;

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);

    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        initialState,
    } = tableInstance;
    initialState.pageSize = 11;


    const handleDelete = ({ id }) => {
        console.log(id)
        // axios.delete(`http://localhost:8080/api/v1/product?id=${id}`)
    }

    return (
        <Table>
            
                {headerGroups.map((headerGroup, index) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                        {headerGroup.headers.map((column, index) => (
                            <TableHead
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                pe='10px'
                                key={index}>
                                {column.render("Header")}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            
            <TableBody {...getTableBodyProps()}>
                {page.map((row, index) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()} key={index}>
                            {row.cells.map((cell, index) => {

                                let data = regret(cell);
                                return (
                                    <TableCell
                                        {...cell.getCellProps()}
                                        key={index}
                                        fontSize={{ sm: "14px" }}
                                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                        borderColor='transparent'>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell><div className="w-full h-full" onClick={() => { handleDelete(row.id) }}><FaTrashAlt /></div></TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}


function regret(cell) {
    if (!cell.value) {
        return <p className="text-sm font-bold">null!</p>
    } else if (cell.value.customElement) {
        return cell.value.customElement
    } else {
        return <p className="text-sm font-bold">
            {cell.value || cell.value.value}
        </p>
    }
}
