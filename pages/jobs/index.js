import { Inter } from 'next/font/google';
import { useState } from 'react';
import Image from 'next/image';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaDiscord } from 'react-icons/fa';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

const ApplyModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, contact, message, selectedFile });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg w-96 p-6">
        <h3 className="text-xl font-semibold mb-4">Apply for Workgroup</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-800 focus:ring-0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-300">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1 block w-full bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-800 focus:ring-0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-800 focus:ring-0"
            ></textarea>
          </div>
          <div
            className="mb-4 p-4 border-2 border-dashed border-gray-500 rounded-md"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="text-sm text-gray-300">Drag and drop your CV/resume here</p>
            {selectedFile && <p className="mt-2 text-sm text-gray-400">{selectedFile.name}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobDetails = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const jobs = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      company: 'Creator Success',
      description: 'As a Product Engineer, you will work within a Product Delivery Team baked with UX, engineering, product and data talent. You will help the team design beautiful interfaces and experiences for our clients.',
      image: '/company-logo-1.png',
    },
    {
      id: 2,
      title: 'Software Engineer',
      company: 'Tech Startup',
      description: 'We are looking for a talented software engineer to join our team. You will be working on building cutting-edge web applications using modern technologies.',
      image: '/company-logo-2.png',
    },
    // Add more job listings...
  ];

  const handleJobClick = (job) => {
    setSelectedJob(job);
};

  const handleApply = (data) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  };

  const handleLogin = () => {
    setShowLoginPrompt(false);
    signIn('discord', { callbackUrl: router.asPath });
  };

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

      <main className="px-5 sm:px-10 md:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Workgroup Listings</h2>
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className={`p-4 rounded-lg cursor-pointer transition duration-300 ${
                    selectedJob?.id === job.id ? 'bg-gray-800' : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => handleJobClick(job)}
                >
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-400">{job.company}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Workgroup Profile</h2>
            {selectedJob ? (
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 relative">
                    <Image src={selectedJob.image} alt={selectedJob.company} layout="fill" objectFit="cover" className="rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedJob.company}</h3>
                    <p className="text-gray-400">{selectedJob.title}</p>
                  </div>
                </div>
                <p>{selectedJob.description}</p>
                <button
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                    if (!session) {
                        setShowLoginPrompt(true);
                    } else {
                        setIsModalOpen(true);
                    }
                }}
              >
                Apply Now
              </button>
              </div>
            ) : (
              <p className="text-gray-400">Select a job to view company profile</p>
            )}
          </div>
        </div>
      </main>

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApply}
      />

      <footer className="text-center p-5 border-t border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        © 2024 JupRecruit Team.
      </footer>
      <SpeedInsights />

      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Login Required</h2>
            <p className="text-gray-300 mb-6">Please log in with Discord to apply for the job.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                <div className="flex items-center">
                  <FaDiscord className="mr-2" />
                  <span>Login with Discord</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
