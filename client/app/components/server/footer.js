import React from 'react'
import { FaFacebook, FaInstagramSquare, FaWhatsapp, FaTwitter } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import Image from 'next/image';
 
const Footer = () => {
  return (
    <div className='bg-gray-900 text-white py-4'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between'>
        <div className='h-16 w-16 md:h-20 md:w-20'><Image src='/yatri.jpg' width="100" height="100"  className='object-contain h-full w-full' /></div>
        <div className='text-center md:text-left'>
          <p className='text-sm md:text-base'>Customer Support: 9:00 AM-6:00 PM Nepal Time (Sun-Fri)</p>
        </div>
        <div className='flex justify-center md:justify-end mt-4 md:mt-0'>
          <ul className='flex flex-row cursor-pointer'>
            <li className='px-2'><FaFacebook size={24} /></li>
            <li className='px-2'><FaWhatsapp size={24} /></li>
            <li className='px-2'><FaInstagramSquare size={24} /></li>
            <li className='px-2'><FaTwitter size={24} /></li>
            <li className='px-2'><IoLogoYoutube size={24} /></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4">
      <div className="items-center xl:justify-between flex flex-wrap -mx-4">
        <div className="px-4 relative  xl:w-6/12 w-full sm:w-full">
          <div className="text-center xl:text-right py-6 text-sm text-blueGray-500">Copyright © 2021<a href="" target="_blank" className="font-semibold ml-1">Yatri-Tickets</a>. All rights reserved.</div>
        </div>
        <div className="px-4 relative  xl:w-6/12 w-full sm:w-full">
          <ul className="justify-center xl:justify-start mx-auto flex flex-wrap list-none pl-0 mb-0">
            <li><a href="" target="_blank" className="text-sm block px-4 bg-transparent no-underline text-blueGray-500 hover:text-blueGray-700 py-4 md:py-6 mx-auto">Yatri Tickets</a></li>
            <li><a href="" target="_blank" className="text-sm block px-4 bg-transparent no-underline text-blueGray-500 hover:text-blueGray-700 py-4 md:py-6 mx-auto">About us</a></li>
            <li><a href="" target="_blank" className="text-sm block px-4 bg-transparent no-underline text-blueGray-500 hover:text-blueGray-700 py-4 md:py-6 mx-auto">Blog</a></li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  )
}
 
export default Footer