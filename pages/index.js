import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
const inter = Inter({ subsets: ["latin"] });
import Image from 'next/image'; // Import the Image component
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Basic Swiper styles
import 'swiper/css/navigation'; // Navigation styles
import { Autoplay, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
SwiperCore.use([Autoplay, Navigation]);

export default function Home() {

  // Define your working groups data.
  const workingGroups = [
    { title: 'JUP CWG', image: '/cat1.jpg', placeholder: 'Placeholder 1 text for first circle' },
    { title: 'JUP CATDET WG',  image: '/cat2.jpg', placeholder: 'Placeholder 2 text for second circle' },
    { title: 'UPLINK WG',  image: '/cat3.jpg', placeholder: 'Placeholder 3 text for third circle' },
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
    <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
      <header className="flex justify-between items-center p-5 border-b border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-xl font-bold bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
          Jupiter Talent Acquisition Group
        </h1>
        <nav>
          <a href="#explore" className="p-2 sm:p-3 md:px-5 md:py-4 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition cursor-pointer backdrop-blur-md" 
            style={{ color: 'rgb(217, 249, 157)', fontWeight: 'bold' }}>
            Explore
          </a>
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
            <div className="border-t border-b border-gray-700 my-16"></div>
          </div>

          <div className="mb-10"></div> {/* This is the spacer div, you can adjust the value as needed */}


        {/* Talent Community Section */}
        <div className="flex items-center justify-center my-16 mx-5">
          <div className="flex-1 max-w-lg">
            <h3 className="text-5xl font-bold mb-9 text-left">Meowdy there! Yes, you pawsitively talented cat -</h3>
            <p className="text-left text-lg mb-9">Join our Talent Community Today!</p>
            <div className="flex justify-start items-center gap-4">
              {/* Create a profile button with glassy style */}
              <button className="p-3 lg:px-5 lg:py-4 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition font-bold backdrop-blur-md"
                      style={{ color: 'rgb(217, 249, 157)' }}>
                Create a profile
              </button>

              {/* What's this? button with glassy style */}
              <button className="p-3 lg:px-5 lg:py-4 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition font-bold backdrop-blur-md"
                      style={{ color: 'rgb(217, 249, 157)' }}>
                What's this?
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-xs flex justify-center">
            <div className="rounded-full overflow-hidden flex items-center justify-center w-full h-full">
              <Image src="/catt_prev_ui.png" alt="Circle Logo" width={900} height={900} className="object-cover" />
            </div>
          </div>
        </div>

          <div className="mb-32"></div> {/* This is the spacer div, you can adjust the value as needed */}


      {/* Working Groups Section */}
      <section className="text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Meet the JWGs</h3>
        {/* <p className="text-sm sm:text-md md:text-sm text-gray-400 mb-4">Swipe to navigate</p> */}
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          navigation
          loop
          autoplay={{
            delay: 3000, // 1000ms = 1 second
            disableOnInteraction: false, // autoplay will not be disabled after user interactions
          }}
          className="mySwiper"
        >
          {workingGroups.map((group, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500">
                  <Image src={group.image} alt={group.title} width={160} height={160} className="object-cover" />
                </div>
                <h4 className="mt-4 text-xl font-bold">{group.title}</h4>
                <p className="text-sm mt-2">{group.placeholder}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

        <div className="mb-32"></div> {/* This is the spacer div, you can adjust the value as needed */}


        {/* Explore Opportunities Section */}
        <div className="flex items-center justify-center my-16 mx-5">
          <div className="flex-1 max-w-lg">
            <h3 className="text-5xl font-bold mb-9 text-left">What J.U.P. needs now - it might be you.</h3>
            <p className="text-left text-xl mb-4">J.U.P something opportunity something talent, skills. Explore the planet for opportunities.</p>
            {/* View all button with updated style */}
            <button className="p-3 lg:px-5 lg:py-4 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition mb-4 backdrop-blur-md" 
                    style={{ color: 'rgb(217, 249, 157)', fontWeight: 'bold' }}>
              View All
            </button>
          </div>
          
          <div className="flex-1 max-w-xs flex justify-center">
            <div className="flex flex-col items-center justify-center space-y-4 ml-56">
              {/* Job buttons with updated style and hover effect */}
              <button className="rounded-lg px-6 py-3 w-96 flex flex-col items-center justify-center bg-white/[.20] hover:bg-white/[.30] transition font-bold" 
              style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Contract Specialist</span>
              <span className="text-sm">Legal/Compliance, TAWG</span>
            </button>
              
              <button className="rounded-lg px-6 py-3 w-96 flex flex-col items-center justify-center bg-white/[.20] hover:bg-white/[.30] transition font-bold" 
              style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Job Title</span>
              <span className="text-sm">Category, Working Group</span>
            </button>

              <button className="rounded-lg px-6 py-3 w-96 flex flex-col items-center justify-center bg-white/[.20] hover:bg-white/[.30] transition font-bold" 
              style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Job Title</span>
              <span className="text-sm">Category, Working Group</span>
            </button>
            </div>
          </div>
        </div>

          <div className="mb-32"></div> {/* This is the spacer div, you can adjust the value as needed */}

            {/* The Process Section */}
            <section className="my-16 mx-5">
              <div className="flex items-center justify-center">
                <div className="flex-1 max-w-lg">
                  <h3 className="text-5xl font-bold mb-9 text-left">The Process</h3>
                  <p className="text-left text-xl mb-4">Follow these steps to get started on your journey.</p>
                  <div className="flex justify-start items-center gap-8"> {/* Gap adjusted for visual spacing */}
                    {/* Line with Steps */}
                    <span className="h-1 flex-grow bg-gray-300"></span>
                    <div className="text-white">Apply</div>
                    <span className="h-1 flex-grow bg-gray-300"></span>
                    <div className="text-white">Interview</div>
                    <span className="h-1 flex-grow bg-gray-300"></span>
                    <div className="text-white">Hire</div>
                    <span className="h-1 flex-grow bg-gray-300"></span>
                    <div className="text-white">Grow</div>
                    <span className="h-1 flex-grow bg-gray-300"></span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mb-32"></div> {/* This is the spacer div, you can adjust the value as needed */}


            {/* About Us Section */}
            <section className="my-16 text-center">
            <h3 className="text-4xl font-bold mb-6">About Us</h3>
            <p className="text-lg text-gray-400 mb-4">Lorem Ipsum</p>
          </section>

        </div>
      </main>
      

      <footer className="text-center p-5 border-t border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        © 2024 JupRecruit Team.
      </footer>
    </div>
  );
}