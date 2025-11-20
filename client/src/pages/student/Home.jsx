import React from 'react';
import Hero from '../../components/student/Hero';
import CoursesSection from '../../components/student/CoursesSection';
import CallToAction from '../../components/student/CallToAction';
import Footer from '../../components/student/Footer';
import TransactionChecker from '../../components/student/TransactionChecker';

const Home = () => {
    return (
        <>
            
            <div className='flex flex-col items-center space-y-7 text-center'>
                <Hero />
                <CoursesSection />
                <TransactionChecker />
                <CallToAction />
                <Footer />
            </div>
        </>
    );
}

export default Home;
