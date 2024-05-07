import { Inter } from "next/font/google";
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
const inter = Inter({ subsets: ["latin"] });
import Image from 'next/image';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
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
    { title: 'CORE WG', image: '/cat1.jpg', placeholder: 'Placeholder 1 text for first circle' },
    { title: 'UPLINK WG', image: '/cat2.jpg', placeholder: 'Placeholder 2 text for second circle' },
    { title: 'WEN WG', image: '/cat3.jpg', placeholder: 'Placeholder 3 text for third circle' },
    { title: 'CATDET WG', image: '/cat3.jpg', placeholder: 'Placeholder 4 text for third circle' },
    { title: 'REDDIT WG', image: '/cat3.jpg', placeholder: 'Placeholder 5 text for third circle' },
    { title: 'WEB WG', image: '/cat3.jpg', placeholder: 'Placeholder 6 text for third circle' },
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
      <Head>
        <title>JUPRecruit</title>
        <link rel="icon" href="/catt_logo.ico" />
      </Head>
      <header className="flex justify-between items-center p-1 border-b border-gray-700 backdrop-blur-md bg-opacity-30">
    <Link href="/">
      <div className="w-14 h-14 rounded-full overflow-hidden ml-12" style={{ position: 'relative', top: '8px' }}>
        <Image src="/catt_logo.png" alt="Logo" width={40} height={40} className="object-cover" />
      </div>
    </Link>
    <nav>
      {session ? (
        <div className="flex items-center space-x-4"> {/* This container is for logged in state */}
          <span className="text-white">{session.user.name}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4"> {/* This container is for logged out state */}
          <button
            onClick={() => signIn('discord')}
            className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            <div className="flex items-center">
              <FaDiscord className="mr-2" />
              <span>Login with Discord</span>
            </div>
          </button>
          <button
            onClick={() => signIn('twitter')}
            className="px-3 py-1 rounded-md bg-blue-400 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300"
          >
            <div className="flex items-center">
              <FaTwitter className="mr-2" />
              <span>Login with Twitter</span>
            </div>
          </button>
        </div>
      )}
    </nav>
  </header>

<div className="w-full h-64 sm:h-96 relative overflow-hidden border-b border-gray-700">
  <div 
    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
    style={{ 
      backgroundImage: `url(/catt_banner.png)`,
      backgroundSize: 'cover', // Ensure the image covers the entire area
      backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      backgroundPosition: 'center', // Center the image within the header
      transform: `translateY(${offsetY * 0.5}px)`, // Optional: if you need to adjust vertically
    }}
  />
</div>

      <main className="px-5 sm:px-10 md:px-20 space-y-8 sm:space-y-12 md:space-y-24 py-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
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
              <a
                className="rounded-xl text-[#C7F284] text-lg font-semibold px-6 py-3 flex flex-row items-center border-[#C7F28433] border-[1.5px] border-solid z-10 bg-[#C7F2840D] gap-3 hover:bg-[#C7F28426] transition"
                style={{ color: 'rgb(217, 249, 157)', fontWeight: 'bold' }}
              >
                Create a Profile
              </a>
            </Link>
            <button
            className="rounded-xl text-[#C7F284] text-lg font-semibold px-6 py-3 flex flex-row items-center border-[#C7F28433] border-[1.5px] border-solid z-10 bg-[#C7F2840D] gap-3 hover:bg-[#C7F28426] transition animate-move animate-pulse"
            style={{ boxShadow: '0px 1.536px 3.072px 0px rgba(16, 24, 40, 0.05)', color: 'rgb(217, 249, 157)' }}
          >
            What's this?
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 21 21"
              color="#C7F284"
              className="ml-2 transition duration-300 transform group-hover:translate-y-1"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.56"
                d="M10.145 4.225v13.333m0 0 5-5m-5 5-5-5"
              ></path>
            </svg>
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
              <a
                className="rounded-xl text-[#C7F284] text-lg font-semibold px-6 py-3 flex flex-row items-center border-[#C7F28433] border-[1.5px] border-solid z-10 bg-[#C7F2840D] gap-3 hover:bg-[#C7F28426] transition"
                style={{ color: 'rgb(217, 249, 157)' }}
              >
                View All </a>
            </Link>
              </div>
            </div>
          </div>


          <div className="flex-1 max-w-xs mt-8 md:mt-0 md:ml-10 space-y-4">
            {/* Job buttons with updated style and hover effect */}
            <button className="rounded-xl text-[#C7F284] text-lg font-semibold px-6 py-3 w-full md:w-96 flex flex-row items-center justify-center border-[#C7F28433] border-[1.5px] border-solid z-10 bg-[#C7F2840D] gap-3 hover:bg-[#C7F28426] transition"
                    style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Web Working Group</span>
              <span className="text-sm">-</span>
            </button>
            
            <button className="rounded-xl text-[#C7F284] text-lg font-semibold px-6 py-3 w-full md:w-96 flex flex-row items-center justify-center border-[#C7F28433] border-[1.5px] border-solid z-10 bg-[#C7F2840D] gap-3 hover:bg-[#C7F28426] transition"
                    style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Catdet Working Group</span>
              <span className="text-sm">-</span>
            </button>

            <button className="rounded-xl text-[#C7F284] text-lg font-semibold px-6 py-3 w-full md:w-96 flex flex-row items-center justify-center border-[#C7F28433] border-[1.5px] border-solid z-10 bg-[#C7F2840D] gap-3 hover:bg-[#C7F28426] transition"
                    style={{ color: 'rgb(217, 249, 157)' }}>
              <span className="text-lg">Reddit Working Group</span>
              <span className="text-sm">-</span>
            </button>
          </div>
        </div>


        {/* The Process Section */}
        <section className="my-16 mx-5">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="max-w-full w-full text-center"> {/* Changed to always center text */}
              {/* <h3 className="text-2xl md:text-4xl font-bold mb-6">The Process</h3> */}
              <div className="mt-4">
                {/* Responsive Image Container */}
                <div className="relative w-full" style={{ height: 'auto' }}> {/* Removing fixed aspect ratio */}
                  <Image
                    src="/process.png" // Update the path as necessary
                    alt="Detailed Process Image"
                    layout="responsive" // This will make the image responsive to the container's width
                    width={5000} // Set the original width of the image
                    height={1250} // Set the original height of the image
                    objectFit="contain" // Ensures the image scales down if necessary to fit within the container without being cropped
                    priority // This will load the image immediately on page load
                  />
                </div>
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}