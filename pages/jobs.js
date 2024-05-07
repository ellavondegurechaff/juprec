import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { FaDiscord, FaTwitter, FaUpload, FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] });


export default function JobDetails() {
  const { data: session } = useSession();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [errors, setErrors] = useState({});

  const jobs = useMemo(() => [
    {
      id: 1,
      title: 'Position Name',
      company: {
        name: 'Working Group',
        description: `
          <p><strong>Workgroup:</strong> Placeholder for intro/about text.</p>
          <p><strong>Responsibilities:</strong></p>
          <ul>
            <li>Etiam pulvinar leo vel velit lacinia imperdiet.</li>
            <li>In molestie lectus vitae nisl laoreet feugiat.</li>
            <li>Sed efficitur tellus eget metus posuere mollis.</li>
          </ul>
          <p><strong>Requirements:</strong></p>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Suspendisse sit amet nunc vehicula, efficitur mauris eget, efficitur arcu.</li>
            <li>Donec sed leo tristique, pretium neque ac, sodales magna.</li>
            <li>Vivamus id elit ut eros imperdiet rutrum a sed nibh.</li>
          </ul>
        `,
        image: '/cat1.jpg',
      },
    },
    {
      id: 2,
      title: 'Position Name',
      company: {
        name: 'Working Group',
        description: `
          <p><strong>Workgroup:</strong> Placeholder for intro/about text.</p>
          <p><strong>Responsibilities:</strong></p>
          <ul>
            <li>Etiam pulvinar leo vel velit lacinia imperdiet.</li>
            <li>In molestie lectus vitae nisl laoreet feugiat.</li>
            <li>Sed efficitur tellus eget metus posuere mollis.</li>
          </ul>
          <p><strong>Requirements:</strong></p>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Suspendisse sit amet nunc vehicula, efficitur mauris eget, efficitur arcu.</li>
            <li>Donec sed leo tristique, pretium neque ac, sodales magna.</li>
            <li>Vivamus id elit ut eros imperdiet rutrum a sed nibh.</li>
          </ul>
        `,
        image: '/cat2.jpg',
      },
    },
    {
      id: 3,
      title: 'Position Name',
      company: {
        name: 'Working Group',
        description: `
          <p><strong>Workgroup:</strong> Placeholder for intro/about text.</p>
          <p><strong>Responsibilities:</strong></p>
          <ul>
            <li>Etiam pulvinar leo vel velit lacinia imperdiet.</li>
            <li>In molestie lectus vitae nisl laoreet feugiat.</li>
            <li>Sed efficitur tellus eget metus posuere mollis.</li>
          </ul>
          <p><strong>Requirements:</strong></p>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Suspendisse sit amet nunc vehicula, efficitur mauris eget, efficitur arcu.</li>
            <li>Donec sed leo tristique, pretium neque ac, sodales magna.</li>
            <li>Vivamus id elit ut eros imperdiet rutrum a sed nibh.</li>
          </ul>
        `,
        image: '/cat3.jpg',
      },
    },
  ], []);

  
  const workingGroups = useMemo(() => [
    { title: 'JUP CWG', image: '/cat1.jpg', placeholder: 'Placeholder 1 text for first circle' },
    { title: 'JUP CATDET WG', image: '/cat2.jpg', placeholder: 'Placeholder 2 text for second circle' },
    { title: 'UPLINK WG', image: '/cat3.jpg', placeholder: 'Placeholder 3 text for third circle' },
  ], []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setFileError('Please upload a valid file type (PNG, JPG, PDF, DOCX).');
      } else {
        setSelectedFile(acceptedFiles[0]);
        setFileError(null);
      }
    },
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  const openModal = useCallback((job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
    setName('');
    setContact('');
    setMessage('');
    setSelectedFile(null);
    setFileError(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!contact) newErrors.contact = 'Contact is required';
    if (!message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFileToDrive = async (file, positionName) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('positionName', positionName); // Add position name to form data
  
      const response = await fetch('/api/uploadToDriveJobs', { // Updated endpoint
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('File uploaded to Google Drive successfully');
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to upload file to Google Drive: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      alert('Failed to upload file to Google Drive.');
    }
  };

  const handleApply = async () => {
    if (!validateForm()) return;
  
    // Display loading state
    toast.info('Submitting your application...', {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark"
    });
  
    try {
    // Upload file to Google Drive with position name
    if (selectedFile && selectedJob.title) {
      await uploadFileToDrive(selectedFile, selectedJob.title);
    }
  
      // Submit form data to Google Sheets
      const formData = {
        name,
        contact,
        message,
        workgroup: selectedJob.company.name,
        position: selectedJob.title,
      };
  
      const response = await fetch('/api/submitFormJobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData, session }),
      });
  
      if (response.ok) {
        // Display success message
        toast.success('Application submitted successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme:"dark"
        });
  
        // Clear form fields and close modal
        closeModal();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
      alert('Failed to apply for job. Please try again.');
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text mb-8">
          Job Listings
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#1B2229] rounded-lg shadow-lg p-6 transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => openModal(job)}
            >
              <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500">
                <Image src={job.company.image} alt={job.company.name} width={64} height={64} className="object-cover" layout="responsive" />
              </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-v2-lily">{job.title}</h2>
              <p className="text-sm text-v2-lily/50 mb-4">{job.company.name}</p>
              <button className="px-3 py-1.5 rounded-md flex items-center justify-center space-x-1 text-v2-lily text-xs font-semibold border border-v2-lily/20 bg-v2-lily/5 enabled:hover:bg-v2-lily/10 transition duration-300">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
          <div className={`fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-75 transition-opacity ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-[#1B2229] rounded-lg w-full max-w-lg p-8 mx-4 transition-transform duration-300 ease-in-out transform hover:scale-105 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="mb-6">
            <p className="text-lg font-bold">{selectedJob.company.name}</p>
            <div
              className="text-sm text-v2-lily/50"
              dangerouslySetInnerHTML={{ __html: selectedJob.company.description }}
            />
          </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-v2-lily/50">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!session}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block text-xs font-medium text-v2-lily/50">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!session}
                />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-v2-lily/50">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!session}
                  placeholder={`Abilities, Skills, Responsibilities..`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <hr className="w-full h-[1px] bg-v2-lily-5 border-none"></hr>

              <div>
                <label htmlFor="resume" className="block text-xs font-medium text-v2-lily/50 mb-1">
                  Resume / Portfolio
                </label>
                <div
                  {...getRootProps()}
                  role="presentation"
                  className={`p-6 rounded-xl border-2 border-v2-lily-5 bg-v2-lily-5 flex flex-col items-center ${
                    isDragActive ? 'opacity-100' : 'opacity-30'
                  } ${!session && 'cursor-not-allowed'}`}
                >
                  <input {...getInputProps()} disabled={!session} />
                  {!selectedFile ? (
                    <>
                      <FaUpload className="text-4xl text-v2-lily mb-2" />
                      <p className="mt-3 text-center text-v2-lily/75 text-xs">
                        {isDragActive ? (
                          <span>Drop the file here...</span>
                        ) : (
                          <>
                            <b className="font-semibold text-v2-lily">Click to upload</b> or drag and drop
                            <br />
                            PNG, JPG, PDF or DOCX (Max Size: 5MB)
                          </>
                        )}
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-md w-full">
                        <span className="text-v2-lily truncate">{selectedFile.name}</span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-v2-lily hover:text-red-500 focus:outline-none"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleApply}
                disabled={!session}
                className="bg-v2-primary px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 text-[#475C26] text-xl font-bold border border-v2-primary/20 enabled:hover:bg-v2-primary/10 transition duration-300 flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Apply Now</span>
              </button>
            </div>
            {!session && (
              <p className="text-red-500 text-xs mt-4 text-center">Please log in to apply for this workgroup</p>
            )}
          </div>
        </div>
      )}
      <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    </div>
  );
}
// Implement getServerSideProps to fetch session data
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}