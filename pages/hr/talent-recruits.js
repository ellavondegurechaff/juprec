import { Inter } from "next/font/google";
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { FaSearch, FaSortAmountDown, FaSortAmountUpAlt, FaTrash } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';
import Sidebar from '../components/Sidebar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { requireAdmin } from "../middleware";

const inter = Inter({ subsets: ["latin"] });

const RecruitCard = ({ recruit, index, openRecruitDetails, moveRecruit, deleteRecruit }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'recruit',
    item: { id: recruit.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={drag}
      className="bg-gray-800 rounded-lg shadow p-6 cursor-pointer"
      onClick={() => openRecruitDetails(recruit)}
      style={{ opacity }}
    >
      <h2 className="text-xl font-bold mb-2">{recruit.name}</h2>
      <p className="text-sm text-gray-500">Submitted by: {recruit.logged_username}</p>
    </div>
  );
};

const TrashIcon = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'recruit',
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

export default function TalentRecruits() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [talentRecruits, setTalentRecruits] = useState([]);
  const [selectedRecruit, setSelectedRecruit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchTalentRecruits = async () => {
      try {
        const { data: recruits, error } = await supabase
          .from('talent_recruits')
          .select('*');

        if (error) {
          throw error;
        }

        setTalentRecruits(recruits);
      } catch (error) {
        console.error('Error fetching talent recruits:', error);
      }
    };

    fetchTalentRecruits();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openRecruitDetails = (recruit) => {
    setSelectedRecruit(recruit);
  };

  const closeRecruitDetails = () => {
    setSelectedRecruit(null);
  };

  const deleteRecruit = async (recruitId) => {
    try {
      const response = await fetch(`/api/deleteTalentRecruit?id=${recruitId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTalentRecruits(prevRecruits => prevRecruits.filter(recruit => recruit.id !== recruitId));
        closeRecruitDetails();
      } else {
        console.error('Failed to delete talent recruit');
      }
    } catch (error) {
      console.error('Error deleting talent recruit:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredRecruits = talentRecruits.filter(recruit =>
    recruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recruit.expertise && recruit.expertise.some(expertise => expertise.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (recruit.interests && recruit.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (recruit.talents && recruit.talents.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (recruit.languages && (
      (typeof recruit.languages === 'string' && recruit.languages.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(recruit.languages) && recruit.languages.some(language => language.toLowerCase().includes(searchQuery.toLowerCase())))
    )) ||
    (recruit.description && recruit.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const sortedRecruits = filteredRecruits.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const moveRecruit = (dragIndex, hoverIndex) => {
    const dragRecruit = talentRecruits[dragIndex];
    setTalentRecruits(prevRecruits => {
      const updatedRecruits = [...prevRecruits];
      updatedRecruits.splice(dragIndex, 1);
      updatedRecruits.splice(hoverIndex, 0, dragRecruit);
      return updatedRecruits;
    });
  };

  const handleDeleteRecruit = (item) => {
    deleteRecruit(item.id);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
        <Head>
          <title>Talent Recruits | JUPRecruit</title>
          <link rel="icon" href="/catt_logo.ico" />
        </Head>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className={`flex-1 ml-16 ${sidebarOpen ? 'ml-64' : ''}`}>
            <main className="p-8">
              <h1 className="text-3xl font-bold mb-6">Talent Recruits</h1>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name"
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
                  Sort by Name {sortOrder === 'asc' ? <FaSortAmountDown className="inline-block ml-2" /> : <FaSortAmountUpAlt className="inline-block ml-2" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRecruits.map((recruit, index) => (
                  <RecruitCard
                    key={recruit.id}
                    recruit={recruit}
                    index={index}
                    openRecruitDetails={openRecruitDetails}
                    moveRecruit={moveRecruit}
                    deleteRecruit={deleteRecruit}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>

        <TrashIcon onDrop={handleDeleteRecruit} />

        {selectedRecruit && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg shadow p-8 max-w-3xl w-full overflow-y-auto max-h-screen">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold">{selectedRecruit.name}</h2>
                  <p className="text-gray-400">{selectedRecruit.description}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this recruit?')) {
                        deleteRecruit(selectedRecruit.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={closeRecruitDetails}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Details</h3>
                  <ul className="space-y-4">
                    <li>
                      <strong className="block text-gray-400">Expertise:</strong>
                      {typeof selectedRecruit.expertise === 'string' ? (
                        <ul className="list-disc pl-6">
                          {selectedRecruit.expertise.split(',').map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="list-disc pl-6">
                          {Array.isArray(selectedRecruit.expertise) &&
                            selectedRecruit.expertise.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                        </ul>
                      )}
                    </li>
                    <li>
                      <strong className="block text-gray-400">Experience:</strong>
                      <span>{selectedRecruit.experience}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Interests:</strong>
                      <span>{selectedRecruit.interests}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Talents:</strong>
                      <span>{selectedRecruit.talents}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Languages:</strong>
                      <ul className="list-disc pl-6">
                        {typeof selectedRecruit.languages === 'string' ? (
                          JSON.parse(selectedRecruit.languages).map((language, i) => (
                            <li key={i}>{language}</li>
                          ))
                        ) : (
                          selectedRecruit.languages.map((language, i) => (
                            <li key={i}>{language}</li>
                          ))
                        )}
                      </ul>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Timezone:</strong>
                      <span>{`${selectedRecruit.timezone}`}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Work Preference:</strong>
                      <span>{selectedRecruit.work_preference}</span>
                    </li>
                    <li>
                      <strong className="block text-gray-400">Availability:</strong>
                      <span>{selectedRecruit.availability}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Contact</h3>
                  <ul className="space-y-4">
                    {selectedRecruit.email && (
                      <li>
                        <strong className="block text-gray-400">Email:</strong>
                        <span>{selectedRecruit.email}</span>
                      </li>
                    )}
                    {selectedRecruit.twitter && (
                      <li>
                        <strong className="block text-gray-400">Twitter:</strong>
                        <span>{selectedRecruit.twitter}</span>
                      </li>
                    )}
                    {selectedRecruit.linkedin && (
                      <li>
                        <strong className="block text-gray-400">LinkedIn:</strong>
                        <span>{selectedRecruit.linkedin}</span>
                      </li>
                    )}
                  </ul>

                  {selectedRecruit.previous_work_links && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Previous Work</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {typeof selectedRecruit.previous_work_links === 'string' ? (
                          selectedRecruit.previous_work_links.split(',').map((link, i) => (
                            <li key={i}>
                              <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                {link.trim()}
                              </a>
                            </li>
                          ))
                        ) : (
                          Array.isArray(selectedRecruit.previous_work_links) &&
                          selectedRecruit.previous_work_links.map((link, i) => (
                            <li key={i}>
                              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                {link}
                              </a>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
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
  return await requireAdmin(context.req, context.res);
}