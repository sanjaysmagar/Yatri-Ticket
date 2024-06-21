'use client'

import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

export default function ServicesDropdown(){
  const[isOpen, setIsOpen] = useState(false);
    return(
        <div>
            <li onClick={()=>setIsOpen((prev)=>!prev)} className='px-5 text-center justify-center items-center cursor-pointer flex flex-row hover:text-green-600 relative'>
            Services
            <span className='px-1 items-center justify-center'>
            <IoIosArrowDown size={18} />
          </span>
          {isOpen && (
            <ul className='absolute z-10 top-full left-10 w-28 text-justify bg-slate-50 text-black  py-2 rounded-md opacity-100 transition-opacity duration-300 smooth
            duration={500}'>
              <li className='py-2 ml-3 hover:text-green-600'>Room</li>
              <li className='py-2 ml-3 hover:text-green-600'>Chopper</li>
              <li className='py-2 ml-3 hover:text-green-600'>Forex</li>
              <li className='py-2 ml-3 hover:text-green-600'>Insurance</li>
              <li className='py-2 ml-3 hover:text-green-600'>AdvSports</li>
              <li className='py-2 ml-3 hover:text-green-600'>Vehicles</li>
              <li className='py-2 ml-3 hover:text-green-600'>Education</li>
            </ul>
          )}
          </li>
        </div>
    )
}