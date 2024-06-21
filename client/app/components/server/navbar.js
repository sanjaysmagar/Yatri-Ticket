
import { IoIosArrowDown } from "react-icons/io";
import { FaTimes, FaBars } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link'
import dynamic from 'next/dynamic';
const ServicesDropdown = dynamic(() => import('../client/servicesDropdown'), { ssr: false });
const UserInfo = dynamic(() => import('../client/userInfo'), { ssr: false });
 
const Navbar = () => {

  



  const links = [
    {
      id:1,
      link:'Home'
    },
    {
      id:2,
      link:'About Us'
    },
    {
      id:3,
      link:'Services'
    },
    {
      id:4,
      link:'Contact'
    },
    {
      id:5,
      link:'Blog'
    }
  ];
 
 
  return (
    <div className='flex justify-between shadow-lg  shadow-slate-950 rounded-sm items-center w-full h-20 text-purple-950 bg-slate-50' >
       <div className="ml-6">
           <Image src="/logo.png" alt="logo" width="85" height="85" className='object-contain h-full w-full' ></Image>
      </div>
      <ul className='hidden md:flex mr-16' >
          <li className='px-5 text-center justify-center items-center cursor-pointer  hover:text-green-600'>Home</li>
          <li className='px-5 text-center justify-center items-center cursor-pointer  hover:text-green-600'>About Us</li>
           
            <ServicesDropdown/>
            
          <li className='px-5 text-center justify-center items-center cursor-pointer  hover:text-green-600'>Contact</li>
          <li className='px-5 text-center justify-center items-center cursor-pointer  hover:text-green-600'>Blog</li>
      </ul>
      <UserInfo />

    {/*  <div onClick={()=> setNav(!nav)} className='cursor-pointer pr-4 z-10  md:hidden'>
        {nav?<FaTimes size={30}/>:<FaBars size={30}/>}
      </div>
      {nav && (
        <ul className='flex flex-col justify-center items-center absolute top-0 right-0  h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500 w-full '>
          {links.map(({id,link}) => (
            <li key={id} className='px-4 cursor-pointer capitalize py-6 text-4xl hover:scale-105 hover:bg-zinc-950 rounded-md'> <Link
              onClick={() => setNav(!nav)}
              to={link}
              smooth
              duration={500}
            >
              {link}
            </Link></li>
          ))}
        </ul>
      )} */}
    </div>
  )
}
 
export default Navbar
 