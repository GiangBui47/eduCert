import React from 'react'

const StudentsModal = ({ isOpen, onClose, course, students = [], totalLectures = 0 }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white w-11/12 max-w-2xl rounded-lg shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Enrolled Students</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="text-base font-medium text-gray-900">{course?.Course || course?.courseTitle}</p>
                </div>
                <div className="max-h-80 overflow-y-auto border rounded-md">
                    {students.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No students yet.</p>
                    ) : (
                        <ul>
                            {students.map((s, idx) => {
                                const completed = typeof s.completedLectures === 'number' ? s.completedLectures : 0;
                                const total = totalLectures || 0;
                                const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
                                return (
                                    <li key={idx} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
                                        <img src={s.student?.imageUrl} alt={s.student?.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{s.student?.name}</p>
                                            {s.purchaseDate && (
                                                <p className="text-xs text-gray-500">Purchased on: {new Date(s.purchaseDate).toLocaleString()}</p>
                                            )}
                                            <div className="mt-1">
                                                <p className="text-xs text-gray-600">Completed: {completed}/{total} lessons</p>
                                                <div className="h-2 bg-gray-200 rounded">
                                                    <div className="h-2 bg-blue-600 rounded" style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
                </div>
            </div>
        </div>
    )
}

export default StudentsModal


