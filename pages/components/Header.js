import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-1 border-b border-gray-700 backdrop-blur-md bg-opacity-30">
      <div className="flex items-center">
        <Link href="/">
          <div className="w-14 h-14 rounded-full overflow-hidden ml-12" style={{ position: 'relative', top: '8px' }}>
            <Image src="/catt_logo.png" alt="Logo" width={40} height={40} className="object-cover" />
          </div>
        </Link>
        <Link href="/">
          <span className="ml-0 text-xl font-bold text-white cursor-pointer hover:text-gray-300">Talent Recruitment WG</span>
        </Link>
      </div>
      <nav>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
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
  );
};

export default Header;