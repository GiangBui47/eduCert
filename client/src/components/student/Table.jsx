import React from 'react'
import { assets } from '../../assets/assets'

const Table = ({ columns = [], rows = [] }) => {
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
                    </tr>
                </thead>
                <tbody>
                    {rows?.length > 0 ? (
                        rows.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                {columns.map((_, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-4 py-3 text-center"
                                    >
                                        {colIndex === 0 ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <img
                                                    src={row.thumbnail || assets.course_1_thumbnail}
                                                    alt="course thumbnail"
                                                    className="w-14 sm:w-20 md:w-24 rounded"
                                                />
                                                <span>{row[`content${colIndex + 1}`]}</span>
                                            </div>
                                        ) : (
                                            row[`content${colIndex + 1}`]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-6 text-center text-gray-500"
                            >
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table
