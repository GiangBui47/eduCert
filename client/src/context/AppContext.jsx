import { createContext, useEffect, useState } from 'react';
import { dummyCourses } from "../assets/assets";
import { useNavigate } from 'react-router';
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [allCourses, setAllCourse] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  useEffect(() => {
    const fetchAllCourses = async () => {
      setAllCourse(dummyCourses);
    };
    fetchAllCourses();
  }, []);

  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating
    });
    return Math.floor(totalRating / course.courseRatings.length);
  }

  const handleSearch = (value) => {
    if (!value) {
      setFilteredCourses(allCourses);
    } else {
      setFilteredCourses(
        allCourses.filter(course =>
          course.courseTitle.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    setFilteredCourses(allCourses);
  }, [allCourses]);

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const value = {
    currency,
    navigate,
    allCourses,
    setAllCourse,
    calculateRating,
    filteredCourses,
    handleSearch,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
