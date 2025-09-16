import { createContext, useEffect, useState } from 'react';
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;
  const [allCourses, setAllCourse] = useState([]);

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

  const value = {
    currency,
    allCourses,
    setAllCourse,
    calculateRating
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
