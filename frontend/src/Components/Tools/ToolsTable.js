import React, { useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useFilters, // Import useFilters
} from 'react-table';

import {
    Link
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash, faSortDown, faSortUp, faSort} from "@fortawesome/free-solid-svg-icons";


const AppToolsTable = ({ data,columns }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        setGlobalFilter,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        gotoPage,
        pageCount,
        setPageSize,
    } = useTable(
        {
        columns,
        data,
        filterTypes: {
            text: (rows, id, filterValue) => {
            return rows.filter((row) => {
                const rowValue = row.values[id];
                return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase())
                : true;
            });
            },
        },
        },
        useFilters, // Use useFilters before useSortBy
        useGlobalFilter,
        useSortBy,
        usePagination
    );


    const { pageIndex, pageSize, globalFilter } = state;
    const [selectedColumn] = useState('all'); // Default to search all columns

    return (
        <div>
            <div>
                {data.length >= 0 ? (
                    <p>มากกว่า{data.length}</p>
                ) : (
                    <p>น้อยกว่า{data.length}</p>
                )}

            </div>
        <div className="tableSub">
            <div>    
                <input
                    type="text"
                    value={selectedColumn=== "all"? globalFilter || '':selectedColumn.filterValue || ''}
                    onChange={(e) => selectedColumn === "all" ? setGlobalFilter(e.target.value): selectedColumn.setFilter(e.target.value)}
                    placeholder="ค้นหาทั้งหมด..."
                />
            </div>   
            <table {...getTableProps()} className="table">
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    <th>ลำดับ</th>
                 
                    {headerGroup.headers.map((column) => (
                        column.Header !== "Key" && (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ?  <FontAwesomeIcon icon={faSortDown} />: <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                                </span>
                                <div>
                                    {column.canFilter ? ( // Check if the column can be filtered
                                    <input
                                        type="text"
                                        value={column.filterValue || ''}
                                        onChange={(e) =>
                                        column.setFilter(e.target.value) // Set the filter value for the column
                                        }
                                        placeholder={`ค้นหา ${column.render('Header')}`}
                                    />
                                    ) : null}
                                </div>
                            </th>
                        )
                    ))}
                    <th><FontAwesomeIcon icon={faTrash} /></th>
                    </tr>
                ))}
                
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                        
                    <tr {...row.getRowProps()}>
                        <td>{Number(row.id)+1}</td>
                        {row.cells.map((cell) => {
                        return (   
                            <td {...cell.getCellProps()}><Link to={"/Subject/SubjectNo/"+row.original.ID}>{cell.render('Cell')}</Link></td>
                        );
                        })}
                        
                        <td>{row.original.ID}</td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
        <div>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
            </button>{' '}
            <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            >
            {'>>'}
            </button>{' '}
            <span>
            Page{' '}
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
            </span>
            <span>
            | Go to page:{' '}
            <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
                }}
            />
            </span>{' '}
            <select
            value={pageSize}
            onChange={(e) => {
            setPageSize(Number(e.target.value));
            }}
        >
            {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                Show {pageSize}
                </option>
            ))}
            </select>
        </div>
        </div>
    );
};

export default AppToolsTable;