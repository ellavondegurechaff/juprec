import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import Link from 'next/link';
const inter = Inter({ subsets: ["latin"] });
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaDiscord } from 'react-icons/fa';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
SwiperCore.use([Autoplay, Navigation]);

export default function Home() {
  const { data: session } = useSession();
  const workingGroups = [
    { title: 'JUP CWG', image: '/cat1.jpg', placeholder: 'Placeholder 1 text for first circle' },
    { title: 'JUP CATDET WG', image: '/cat2.jpg', placeholder: 'Placeholder 2 text for second circle' },
    { title: 'UPLINK WG', image: '/cat3.jpg', placeholder: 'Placeholder 3 text for third circle' },
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
    <header className="flex justify-between items-center p-4 border-b border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
        Jupiter Talent Acquisition Group
      </h1>
      <nav>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('discord')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            <div className="flex items-center">
              <FaDiscord className="mr-2" />
              <span>Login with Discord</span>
            </div>
          </button>
        )}
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
            <div className="border-t border-b border-gray-700 my-16"></div>
          </div>
        </div>
        
                {/* Talent Community Section */}
                <div className="flex flex-col md:flex-row items-center justify-center my-16 mx-5">
          <div className="flex-1 max-w-lg text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-bold mb-9">Meowdy there! Yes, you pawsitively talented cat -</h3>
            <p className="text-lg md:text-xl mb-9">Join our Talent Community Today!</p>
            <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-4">
                <Link href="/form" legacyBehavior>
                  <a className="px-5 py-3 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition font-bold backdrop-blur-md" style={{ color: 'rgb(217, 249, 157)', fontWeight: 'bold' }}>
                    Create a Profile
                  </a>
                </Link>
              <button className="px-5 py-3 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition font-bold backdrop-blur-md"
                      style={{ color: 'rgb(217, 249, 157)' }}>
                What's this?
              </button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:ml-10 flex-1 max-w-xs">
            <div className="rounded-full overflow-hidden flex items-center justify-center w-full h-full">
              <Image src="/catt_prev_ui.png" alt="Circle Logo" width={900} height={900} className="object-cover" />
            </div>
          </div>
        </div>
        
        {/* Working Groups Section */}
        <section className="text-center my-16">
          <h3 className="text-2xl md:text-4xl font-bold mb-6">Meet the JWGs</h3>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            navigation
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
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

        {/* Explore Opportunities Section */}
        <div className="flex flex-col md:flex-row items-center justify-center my-16 mx-5">
          <div className="flex-1 max-w-lg space-y-4">
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-3xl md:text-5xl font-bold">What J.U.P. needs now - it might be you.</h3>
              <p className="text-center md:text-left text-md md:text-xl">J.U.P something opportunity something talent, skills. Explore the planet for opportunities.</p>
              <div className="flex justify-center md:justify-start">  {/* Ensures button alignment on mobile and desktop */}
                <Link href="/jobs" legacyBehavior>
                  <a className="px-5 py-3 rounded-2xl bg-white/[.20] hover:bg-white/[.30] transition duration-150 ease-in-out font-bold backdrop-blur-md"
                    style={{ color: 'rgb(217, 249, 157)' }}>
                    View All
                  </a>
                </Link>
              </div>
            </div>
          </div>


          <div className="flex-1 max-w-xs mt-8 md:mt-0 md:ml-10 space-y-4">
            {/* Job buttons with updated style and hover effect */}
            <button className="rounded-lg px-6 py-3 w-full md:w-96 flex flex-col items-center justify-center bg-white/[.20] hover:bg-white/[.30] transition font-bold"
                    style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Contract Specialist</span>
              <span className="text-sm">Legal/Compliance, TAWG</span>
            </button>
            
            <button className="rounded-lg px-6 py-3 w-full md:w-96 flex flex-col items-center justify-center bg-white/[.20] hover:bg-white/[.30] transition font-bold"
                    style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Job Title</span>
              <span className="text-sm">Category, Working Group</span>
            </button>

            <button className="rounded-lg px-6 py-3 w-full md:w-96 flex flex-col items-center justify-center bg-white/[.20] hover:bg-white/[.30] transition font-bold"
                    style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Job Title</span>
              <span className="text-sm">Category, Working Group</span>
            </button>
          </div>
        </div>

        {/* The Process Section */}
        <section className="my-16 mx-5">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
            <div className="max-w-lg text-center md:text-left">
              <h3 className="text-4xl font-bold">The Process</h3>
              <p>Follow these steps to get started on your journey.</p>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 mt-4">
                <div className="text-lg font-bold">Apply</div>
                <div className="h-1 flex-grow bg-gray-300"></div>
                <div className="text-lg font-bold">Interview</div>
                <div className="h-1 flex-grow bg-gray-300"></div>
                <div className="text-lg font-bold">Hire</div>
                <div className="h-1 flex-grow bg-gray-300"></div>
                <div className="text-lg font-bold">Grow</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="my-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">About Us</h3>
          <p className="text-md md:text-lg text-gray-400 mb-4">Lorem Ipsum</p>
        </section>
      </main>

      <footer className="text-center p-5 border-t border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        © 2024 JupRecruit Team.
      </footer>
      <SpeedInsights />
    </div>
  );
}
