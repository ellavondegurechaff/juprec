import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
const inter = Inter({ subsets: ["latin"] });
import Image from 'next/image'; // Import the Image component

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Basic Swiper styles
import 'swiper/css/navigation'; // Navigation styles

// Import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper';

// Install Swiper modules
SwiperCore.use([Navigation]);


export default function Home() {

  // Define your working groups data.
  const workingGroups = [
    { title: '', description: 'JUP CWG', image: '/cat1.jpg' },
    { title: '', description: 'JUP CATDEG WG', image: '/cat2.jpg' },
    { title: '', description: 'UPLINK WG', image: '/cat3.jpg' },
    // ...you can add more items here
  ];

  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      // Use a more performance-friendly method to update the position
      requestAnimationFrame(() => {
        setOffsetY(window.pageYOffset);
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${inter.className}`}>
      <header className="flex justify-between items-center p-5 border-b border-gray-700">
        <h1 className="font-bold text-3xl xl:text-xl bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
          Jupiter Talent Acquisition Group
        </h1>
        <nav>
          <a href="#" className="text-[#C0C7D1] px-4 hover:text-gray-300">Explore</a>
        </nav>
      </header>

      {/* Fixed Banner Image with a border that moves with the scroll */}
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
      <main className="space-y-24">
        <div className="text-center py-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
            JUPRecruit
          </h2>
          {/* Mission Section */}
          <div>
            <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
              Mission Directive
            </h3>
            <p className="text-sm text-gray-400 mb-4">To discover talented catdets and connect them with meaningful opportunites in the cosmos.</p>
            <div className="border-t border-b border-gray-700 my-16"></div>
          </div>

          {/* Talent Community Section */}
          <div className="flex items-center justify-center my-16 mx-5">
            <div className="flex-1 max-w-lg">
              <h3 className="text-5xl font-bold mb-9 text-left">Meowdy there! Yes, you pawsitively talented cat -</h3>
              <div className="flex justify-start items-center gap-4">
                <button className="bg-blue-600 px-6 py-3 rounded font-bold hover:bg-blue-700 transition">Create a profile</button>
                <button className="bg-gray-600 px-6 py-3 rounded font-bold hover:bg-gray-700 transition">What's this?</button>
              </div>
            </div>
            <div className="flex-1 max-w-xs flex justify-center">
            <div className="rounded-full overflow-hidden flex items-center justify-center">
              <img src="/catt_prev_ui.png" alt="Circle Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          </div>

          {/* Working Groups Section */}
          <section className="my-16">
          <h3 className="text-3xl font-bold text-center mb-6">Meet the JWGs</h3>
          <Swiper
            slidesPerView={3} // Show three slides at a time
            spaceBetween={30} // Space between slides
            navigation // Enable navigation
            loop // Enable infinite loop
            className="mySwiper" // Custom class name for styling
          >
            {workingGroups.map((group, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
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

        {/* Explore Opportunities Section */}
        <div className="flex items-center justify-center my-16 mx-5"> {/* Aligning spacing with the Talent Community Section */}
          <div className="flex-1 max-w-lg">
            <h3 className="text-5xl font-bold mb-9 text-left">What J.U.P. needs now - it might be you.</h3>
            <p className="text-left text-xl mb-4">J.U.P something opportunity something talent, skills. Explore the planet for opportunities.</p>
            <button className="bg-blue-600 px-4 py-2 rounded font-bold text-white hover:bg-blue-700 transition mb-4">View all</button> {/* Adjusted button size */}
          </div>
          <div className="flex-1 max-w-xs flex justify-center"> {/* Ensuring alignment and layout consistency */}
            <div className="flex flex-col items-center justify-center space-y-4"> {/* Adding vertical spacing between buttons */}
              <div className="bg-blue-500 rounded-lg px-4 py-2 w-48 flex flex-col items-center justify-center"> {/* Adjusted button width and padding */}
                <div className="text-white text-lg font-bold">Contract Specialist</div>
                <div className="text-white text-sm">Legal/Compliance, TAWG</div>
              </div>
              <div className="bg-blue-500 rounded-lg px-4 py-2 w-48 flex flex-col items-center justify-center">
                <div className="text-white text-lg font-bold">Job Title</div>
                <div className="text-white text-sm">Category, Working Group</div>
              </div>
              <div className="bg-blue-500 rounded-lg px-4 py-2 w-48 flex flex-col items-center justify-center">
                <div className="text-white text-lg font-bold">Job Title</div>
                <div className="text-white text-sm">Category, Working Group</div>
              </div>
            </div>
          </div>
        </div>

          {/* The Process Section */}
          <section className="my-16 text-center">
            <h3 className="text-3xl font-bold mb-6">The Process</h3>
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="h-1 w-16 bg-gray-300"></span>
              <div>Apply</div>
              <span className="h-1 w-16 bg-gray-300"></span>
              <div>Interview</div>
              <span className="h-1 w-16 bg-gray-300"></span>
              <div>Hire</div>
              <span className="h-1 w-16 bg-gray-300"></span>
              <div>Grow</div>
              <span className="h-1 w-16 bg-gray-300"></span>
            </div>
            <div className="border-t border-gray-700 my-16"></div>
          </section>

            {/* About Us Section */}
            <section className="my-16 text-center">
            <h3 className="text-3xl font-bold mb-6">About Us</h3>
            <p className="text-lg text-gray-400 mb-4">Lorem Ipsum</p>
          </section>

        </div>
      </main>
      

      <footer className="text-center p-5 border-t border-gray-700">
        © 2024 JupRecruit. All rights reserved.
      </footer>
    </div>
  );
}