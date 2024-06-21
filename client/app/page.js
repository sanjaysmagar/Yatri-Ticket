import Image from 'next/image';
import Navbar from './components/server/navbar';
import Hero from './components/server/hero'
import Footer from './components/server/footer';

 
export default function HomePage() {
    
  return (
   <div>
    <Navbar />
    <Hero />
    <Footer />
   </div>
  );
}