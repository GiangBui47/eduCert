import React, { useState, useMemo } from 'react'
import { assets } from '../../assets/assets'

const Table = ({ columns = [], rows = [], onEdit, showEditButton = false, itemsPerPage = 5, onRowClick = null }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Tính toán dữ liệu phân trang
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return rows.slice(startIndex, endIndex);
    }, [rows, currentPage, itemsPerPage]);

    // Tính tổng số trang
    const totalPages = Math.ceil(rows.length / itemsPerPage);

    const firstIndex = rows.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
    const lastIndex = rows.length === 0 ? 0 : Math.min(currentPage * itemsPerPage, rows.length);


    // Hàm chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Reset về trang 1 khi rows thay đổi
    React.useEffect(() => {
        setCurrentPage(1);
    }, [rows]);
    return (
        <div className="overflow-x-auto">
            <table className="table-auto md:table-fixed w-full overflow-hidden mt-10 border border-gray-200 rounded-lg shadow">
                <thead className="text-gray-900 border-b border-gray-300 text-[16px] bg-gray-100">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 font-semibold truncate text-center"
                            >
                                {col}
                            </th>
                        ))}
                        {showEditButton && (
                            <th className="px-4 py-3 font-semibold text-center">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData?.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-4 py-3 text-center"
                                    >
                                        {colIndex === 0 ? (
                                            <div className="flex items-center gap-2 ">
                                                <img
                                                    src={row.courseThumbnail || row.imageUrl}
                                                    alt=""
                                                    className="w-14 sm:w-20 md:w-24 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {row[column] ?? row.Course ?? '-'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className={`text-sm ${getStatusColor(column, row[column])}`}>
                                                {row[column] || '-'}
                                            </span>
                                        )}
                                    </td>
                                ))}
                                {showEditButton && (
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(row); }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 mx-auto"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (showEditButton ? 1 : 0)}
                                className="px-4 py-6 text-center text-gray-500"
                            >
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 px-4">
                    <div className="text-sm text-gray-500">
                        Showing {firstIndex} to {lastIndex} of {rows.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 text-sm border rounded-md ${currentPage === page
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const getStatusColor = (column, value) => {
    if (column === 'Status') {
        switch (value) {
            case 'Active':
                return 'text-green-600 font-medium';
            case 'Completed':
                return 'text-blue-600 font-medium';
            case 'Online':
                return 'text-green-600 font-medium';
            default:
                return 'text-red-600 font-medium';
        }
    }

    if (column === 'Completed') {
        return value === 'Yes' ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
    }

    if (column === 'Amount' || column === 'Price') {
        return 'text-green-600 font-semibold';
    }

    return 'text-gray-900';
}

export default Table