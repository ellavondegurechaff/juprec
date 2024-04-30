import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
const inter = Inter({ subsets: ["latin"] });
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Basic Swiper styles
import 'swiper/css/navigation'; // Navigation styles

// Import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper';

// Install Swiper modules
SwiperCore.use([Navigation]);

export default function Home() {
  const workingGroups = [
    { title: 'JUP CWG', description: 'Cat Work Group', image: '/cat1.jpg' },
    { title: 'JUP CATDEG WG', description: 'Cat Design Group', image: '/cat2.jpg' },
    { title: 'UPLINK WG', description: 'Uplink Work Group', image: '/cat3.jpg' },
    // ...you can add more items here
  ];

  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffsetY(window.pageYOffset);
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
      <header className="flex justify-between items-center p-5 border-b border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
          Jupiter Talent Acquisition Group
        </h1>
        <nav>
          <a href="#explore" className="p-2 sm:p-3 md:px-5 md:py-4 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition cursor-pointer backdrop-blur-md" 
            style={{ color: 'rgb(217, 249, 157)', fontWeight: 'bold' }}>
            Explore
          </a>
        </nav>
      </header>

      <div className="w-full h-64 relative overflow-hidden border-b border-gray-700">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ 
            backgroundImage: `url(/cat.jpg)`,
            backgroundSize: 'cover',
            transform: `translateY(${offsetY * 0.5}px) scale(1.2)`,
          }}
        />
      </div>

      <main className="px-5 sm:px-10 md:px-20 space-y-8 sm:space-y-12 md:space-y-24 py-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
            JUPRecruit
          </h2>
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
              Mission Directive
            </h3>
            <p className="text-sm sm:text-md md:text-lg text-gray-400 mb-4">To discover talented catdets and connect them with meaningful opportunities in the cosmos.</p>
            <div className="border-t border-b border-gray-700 my-8 sm:my-12 md:my-16"></div>
          </div>
        </div>

        <section className="text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Meet the JWGs</h3>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            navigation
            loop
            className="mySwiper"
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            {workingGroups.map((group, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500">
                    <Image src={group.image} alt={group.title} width={160} height={160} layout="responsive" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold">{group.title}</h4>
                  <p className="text-sm text-gray-300">{group.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Placeholder for additional description.</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>

      <footer className="text-center p-5 border-t border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        © 2024 JupRecruit Team.
      </footer>
    </div>
  );
}
