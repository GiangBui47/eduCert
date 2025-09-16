import React from 'react'
import Title from './Title'
import { FaLock } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { QRCodeSVG } from 'qrcode.react';
const CheckCertificate = () => {
    return (
        <div className='flex flex-col items-center justify-center  '>
            <div className=''>
                <Title title={'Certificate Verification'} subTitle={'Cardano NFT Explorer'}
                    intro={'Enter a Policy ID and Transaction Hash to verify and view your certificate NFT details'} />
            </div>

            <div className='flex flex-cols-1 md:flex-cols-2'>
                <div className='space-y-7 '>
                    <div >
                        <label className='flex items-center text-base font-semibold gap-2 mb-3' htmlFor="">
                            <FaLock />Policy ID
                        </label>
                        <input type="text" placeholder='Enter PolicyId'
                            className='border p-4 border-gray-500 rounded-lg w-full' />
                    </div>

                    <div >
                        <label className='flex items-center text-base font-semibold gap-2 mb-3' htmlFor="">
                            <FaLock />Transaction Hash
                        </label>
                        <input type="text" placeholder='Enter Transaction Hash'
                            className='border p-4 border-gray-500 rounded-lg w-full' />
                    </div>
                    <button
                        className='border bg-blue-600 flex items-center gap-1 w-full
               text-white rounded-lg px-10 py-3 hover:translate-y-0.5 transition-all transform hover:shadow-md'
                    >
                        <CiSearch /> Verify Certificate
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
                    <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                        <QRCodeSVG
                            value=""
                            size={250}
                            level="H"
                            bgColor="#EEF2FF"
                            fgColor="#4F46E5"
                            includeMargin={true}
                            className="rounded-xl"
                        />
                    </div>
                    <p className="text-lg text-gray-600 text-center">
                        Scan to visit Transaction Explorer
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CheckCertificate
