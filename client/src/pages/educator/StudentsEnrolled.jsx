import React, { useContext, useEffect, useState, useCallback } from 'react';

import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [emailTerm, setEmailTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchEnrolledStudents = useCallback(async (isFirstLoad = false) => {
    try {
      const token = await getToken();
      const url = `${backendUrl}/api/educator/enrolled-students${selectedCourseId ? `?courseId=${selectedCourseId}` : ''}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const studentsWithUserIds = await Promise.all(
          data.enrolledStudents.map(async student => {
            if (student.student?._id) return student;
            try {
              const userResponse = await axios.get(
                `${backendUrl}/api/user/profile/${student.student.userId || student.student.email}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return userResponse.data.success && userResponse.data.user
                ? { ...student, student: { ...student.student, _id: userResponse.data.user._id || 'unknown-id' } }
                : student;
            } catch {
              return { ...student, student: { ...student.student, _id: student.student.userId || 'unknown-id' } };
            }
          })
        );
        const sortedStudents = studentsWithUserIds.reverse();
        setEnrolledStudents(sortedStudents);
        if (isFirstLoad) {
          setFilteredStudents(sortedStudents);
          setCurrentPage(1);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, getToken, selectedCourseId]);

  const fetchCourses = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCourses(Array.isArray(data.courses) ? data.courses : []);
      }
    } catch {}
  }, [backendUrl, getToken]);

  useEffect(() => {
    if (!isEducator) return;
    fetchEnrolledStudents(true);
    fetchCourses();
    const intervalId = setInterval(() => fetchEnrolledStudents(false), 2000);
    const handleVisibilityChange = () => {
      if (!document.hidden && isEducator) fetchEnrolledStudents(false);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEducator, fetchEnrolledStudents, fetchCourses]);

  useEffect(() => {
    if (enrolledStudents) {
      const filtered = enrolledStudents.filter(
        student =>
          student.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.student._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, enrolledStudents]);

  useEffect(() => {
    if (!isEducator) return;
    fetchEnrolledStudents(true);
  }, [selectedCourseId, isEducator, fetchEnrolledStudents]);

  useEffect(() => {
    let timer;
    const run = async () => {
      const q = emailTerm.trim();
      if (!showModal || q.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        setIsSearching(true);
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/educator/students/search?q=${encodeURIComponent(q)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setSuggestions(data.users || []);
      } finally {
        setIsSearching(false);
      }
    };
    timer = setTimeout(run, 300);
    return () => clearTimeout(timer);
  }, [emailTerm, showModal, backendUrl, getToken]);

  const handleAddStudent = async () => {
    try {
      if (!selectedCourseId) {
        toast.error('Please select a course');
        return;
      }
      const email = emailTerm.trim();
      if (!email) {
        toast.error('Please enter student email');
        return;
      }
      setIsAdding(true);
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/educator/courses/${selectedCourseId}/add-student`, { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success('Student added');
        setShowModal(false);
        setEmailTerm('');
        setSuggestions([]);
        fetchEnrolledStudents(true);
      } else {
        toast.error(data.message || 'Failed to add student');
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsAdding(false);
    }
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start bg-gradient-to-b from-blue-50 to-white md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-2"></div>
            Students Enrolled
          </h1>
          <p className="text-gray-600 ml-5">Track all students enrolled in your courses</p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">Total: {enrolledStudents.length} students</span>
            </div>
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All courses</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.courseTitle}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by course name, user ID or student name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
              />
            </div>
            <button onClick={() => setShowModal(true)} disabled={!selectedCourseId} className={`px-4 py-2 rounded-md text-white text-sm ${selectedCourseId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
              Add student
            </button>
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-4 py-3.5 text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3.5 text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="px-4 py-3.5 text-sm font-semibold text-gray-700">Course Title</th>
                  <th className="px-4 py-3.5 text-sm font-semibold text-gray-700">User ID</th>
                  <th className="px-4 py-3.5 text-sm font-semibold text-gray-700">Enrollment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.map((student, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-4 text-center text-gray-500 text-sm font-medium">{startIndex + index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                          <img src={student.student.imageUrl || dummyStudentEnrolled} alt="Student" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.student.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{student.courseTitle}</td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-500 font-mono bg-gray-100 rounded px-2 py-1 break-all">{student.student._id}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(student.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 shadow-sm'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && page - array[index - 1] > 1 && <span className="px-2 py-1 text-gray-500">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center w-8 h-8 mx-0.5 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 shadow-sm'
                }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-5">
            <h3 className="text-lg font-semibold mb-3">Add student to course</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-1">Course</p>
              <select disabled className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100">
                <option>
                  {courses.find(c => c._id === selectedCourseId)?.courseTitle || 'Select course'}
                </option>
              </select>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-700 mb-1">Student email</p>
              <input type="email" value={emailTerm} onChange={e => setEmailTerm(e.target.value)} placeholder="Enter email" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="mt-2 max-h-48 overflow-auto border border-gray-200 rounded-md">
                {isSearching && <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>}
                {!isSearching && suggestions.map(u => (
                  <button key={u._id} type="button" onClick={() => setEmailTerm(u.email)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img src={u.imageUrl || dummyStudentEnrolled} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-800">{u.name}</div>
                        <div className="text-gray-500 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </button>
                ))}
                {!isSearching && suggestions.length === 0 && emailTerm.trim().length >= 2 && (
                  <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm">Cancel</button>
              <button onClick={handleAddStudent} disabled={isAdding || !selectedCourseId} className={`px-4 py-2 rounded-md text-white text-sm ${isAdding || !selectedCourseId ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>{isAdding ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;