import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaChartBar, FaUsers, FaBriefcase, FaFolder } from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const router = useRouter();

  const isActive = (pathname) => {
    return router.pathname === pathname;
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen pt-16 bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <button className="absolute top-4 right-4 text-white focus:outline-none" onClick={toggleSidebar}>
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      <nav className="mt-8">
        <ul>
          <li>
            <Link href="/hr/dashboard">
              <div
                className={`flex items-center px-4 py-2 text-white ${
                  isActive('/hr/dashboard') ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <FaChartBar className="mr-4" />
                <span className={sidebarOpen ? 'block' : 'hidden'}>Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/hr/talent-recruits">
              <div
                className={`flex items-center px-4 py-2 text-white ${
                  isActive('/hr/talent-recruits') ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <FaUsers className="mr-4" />
                <span className={sidebarOpen ? 'block' : 'hidden'}>Talent Recruits</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/hr/job-applications">
              <div
                className={`flex items-center px-4 py-2 text-white ${
                  isActive('/hr/job-applications') ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <FaBriefcase className="mr-4" />
                <span className={sidebarOpen ? 'block' : 'hidden'}>Job Applications</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/hr/file-list">
              <div
                className={`flex items-center px-4 py-2 text-white ${
                  isActive('/hr/file-list') ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <FaFolder className="mr-4" />
                <span className={sidebarOpen ? 'block' : 'hidden'}>File Manager</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;