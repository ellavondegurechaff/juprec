import { Inter } from "next/font/google";
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { FaSearch, FaSortAmountDown, FaSortAmountUpAlt, FaTrash } from 'react-icons/fa';
import { supabase } from '../../utils/supabaseClient';
import Sidebar from '../components/Sidebar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const inter = Inter({ subsets: ["latin"] });

const ApplicationCard = ({ application, index, openApplicationDetails, moveApplication, deleteApplication }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'application',
    item: { id: application.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={drag}
      className="bg-gray-800 rounded-lg shadow p-6 cursor-pointer"
      onClick={() => openApplicationDetails(application)}
      style={{ opacity }}
    >
      <h2 className="text-xl font-bold mb-2">{application.position}</h2>
      <p className="text-sm text-gray-500">Applied by: {application.username}</p>
    </div>
  );
};

const TrashIcon = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'application',
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`fixed bottom-8 right-8 p-4 bg-red-600 rounded-full shadow-lg cursor-pointer ${
        isOver ? 'bg-red-700' : ''
      }`}
    >
      <FaTrash className="text-white text-2xl" />
    </div>
  );
};

export default function JobApplications() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const { data: applications, error } = await supabase
          .from('job_applications')
          .select('*');

        if (error) {
          throw error;
        }

        setJobApplications(applications);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    fetchJobApplications();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicationDetails = () => {
    setSelectedApplication(null);
  };

  const deleteApplication = async (applicationId) => {
    try {
      const response = await fetch(`/api/deleteJobApplication?id=${applicationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobApplications(prevApplications => prevApplications.filter(application => application.id !== applicationId));
        closeApplicationDetails();
      } else {
        console.error('Failed to delete job application');
      }
    } catch (error) {
      console.error('Error deleting job application:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredApplications = jobApplications.filter(application =>
    application.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedApplications = filteredApplications.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.position.localeCompare(b.position);
    } else {
      return b.position.localeCompare(a.position);
    }
  });

  const moveApplication = (dragIndex, hoverIndex) => {
    const dragApplication = jobApplications[dragIndex];
    setJobApplications(prevApplications => {
      const updatedApplications = [...prevApplications];
      updatedApplications.splice(dragIndex, 1);
      updatedApplications.splice(hoverIndex, 0, dragApplication);
      return updatedApplications;
    });
  };

  const handleDeleteApplication = (item) => {
    deleteApplication(item.id);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
        <Head>
          <title>Job Applications | JUPRecruit</title>
          <link rel="icon" href="/catt_logo.ico" />
        </Head>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className={`flex-1 ml-16 ${sidebarOpen ? 'ml-64' : ''}`}>
            <main className="p-8">
              <h1 className="text-3xl font-bold mb-6">Job Applications</h1>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by position"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 pr-10 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={handleSort}
                  className="px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sort by Position {sortOrder === 'asc' ? <FaSortAmountDown className="inline-block ml-2" /> : <FaSortAmountUpAlt className="inline-block ml-2" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedApplications.map((application, index) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    index={index}
                    openApplicationDetails={openApplicationDetails}
                    moveApplication={moveApplication}
                    deleteApplication={deleteApplication}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>

        <TrashIcon onDrop={handleDeleteApplication} />

        {selectedApplication && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg shadow p-8 max-w-3xl w-full overflow-y-auto max-h-screen">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold">{selectedApplication.position}</h2>
                  <p className="text-gray-400">Applied by: {selectedApplication.username}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this job application?')) {
                        deleteApplication(selectedApplication.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={closeApplicationDetails}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Applicant Details</h3>
                  <ul className="space-y-4">
                    <li>
                      <strong className="block text-gray-400">Name:</strong>
                      <span>{selectedApplication.name}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Contact:</strong>
                      <span>{selectedApplication.contact}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Username:</strong>
                      <span>{selectedApplication.username}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Application Details</h3>
                  <ul className="space-y-4">
                    <li>
                      <strong className="block text-gray-400">Workgroup:</strong>
                      <span>{selectedApplication.workgroup}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Position:</strong>
                      <span>{selectedApplication.position}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Message:</strong>
                      <p>{selectedApplication.message}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || !session.user?.isAdmin) {
      return {
          redirect: {
              destination: '/unauthorized',
              permanent: false,
          }
      };
  }
  return {
      props: {
      },
  };
}