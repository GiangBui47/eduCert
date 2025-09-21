// SearchBar.jsx
import React, { useState } from 'react';
import { assets } from '../../assets/assets';

const SearchBar = ({ onSearch }) => {
    const [input, setInput] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        onSearch(value);
    };

    return (
        <div>
            <form className='max-w-xl w-full md:h-14 h-12 flex items-center
            bg-white border border-gray-500/20 rounded-lg mx-auto'>
                <img src={assets.search_icon} alt="search_icon"
                    className='md:w-auto w-10 px-3' />
                <input
                    onChange={handleChange}
                    value={input}
                    type="text"
                    placeholder='Search for courses'
                    className='w-full h-full outline-none text-gray-500/80'
                />
            </form>
        </div>
    );
};

export default SearchBar;
