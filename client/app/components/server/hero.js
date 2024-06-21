import Image from 'next/image';
import Booking from '../client/booking'
 
export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute bg-black-100 z-10"></div>
      <Image 
        src="/hero.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
      <div className='absolute inset-0 bg-black bg-opacity-40'></div>
      <div className="  relative z-20 flex flex-col items-center mt-40 h-full">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-3xl font-bold">Find And Book A Great Experience.</h1>
        <p className='text-base text-white sm:text-lg md:text-xl'>Home of Domestic & International Tickets.</p>
        <Booking/>
      </div>
    </div>
  );
}