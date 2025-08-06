"use client";

import React from 'react';

const Compare = ()  =>{

    return (
        <div className='flex'>
            {/* Left column */}
            <div className="w-1/2 bg-green-100 border-r  p-4">
                <h2 className="text-xl font-semibold text-black">Left Column</h2>
                <p className='text-black'>This is the left side content.</p>

            </div>

            {/* Right column */}
            <div className="w-1/2 bg-green-100 border-r  p-4">
                <h2 className="text-xl font-semibold text-black">Right Column</h2>
                <p className='text-black'>This is the right side content.</p>

            </div>
        </div>
    )

}

export default Compare;