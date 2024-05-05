import { useState } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { FaDiscord, FaTwitter, FaLinkedin, FaUpload, FaTimes, FaEnvelope, FaPlus } from 'react-icons/fa';
import { SpeedInsights } from '@vercel/speed-insights/next';
import {useSession, signIn, signOut, getSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

const ExpertiseOptions = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',
  'Blockchain',
  'Cloud Computing',
  'Cybersecurity',
  'Other'
];

const ExperienceOptions = ['0-2 years', '2-5 years', '5-10 years', '10+ years'];

const InterestOptions = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'DevOps',
  'Artificial Intelligence',
  'Other'
];

const LanguageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

const TimezoneOptions = [
  'UTC-12',
  'UTC-11',
  'UTC-10',
  'UTC-9',
  'UTC-8',
  'UTC-7',
  'UTC-6',
  'UTC-5',
  'UTC-4',
  'UTC-3',
  'UTC-2',
  'UTC-1',
  'UTC',
  'UTC+1',
  'UTC+2',
  'UTC+3',
  'UTC+4',
  'UTC+5',
  'UTC+6',
  'UTC+7',
  'UTC+8',
  'UTC+9',
  'UTC+10',
  'UTC+11',
  'UTC+12',
];

const Modal = ({ isOpen, onClose, title, options, selectedOptions, onOptionChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-md">
      <div className="bg-gray-800 rounded-lg w-96 p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => onOptionChange(option)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function ProfileForm() {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState([]);
  const [experience, setExperience] = useState('');
  const [interests, setInterests] = useState([]);
  const [talents, setTalents] = useState('');
  const [languages, setLanguages] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [description, setDescription] = useState('');
  const [discord, setDiscord] = useState('');
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [previousWorkLinks, setPreviousWorkLinks] = useState(['']);
  const [otherExpertise, setOtherExpertise] = useState('');
  const [otherInterests, setOtherInterests] = useState('');
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState(null);

  //Helpers
  const addNewLinkField = () => {
    if (Array.isArray(previousWorkLinks) && previousWorkLinks.length < 3) {
      setPreviousWorkLinks([...previousWorkLinks, '']);
    }
  };
  
  const removeLinkField = (index) => {
    if (Array.isArray(previousWorkLinks)) {
      const updatedLinks = previousWorkLinks.filter((_, idx) => idx !== index);
      setPreviousWorkLinks(updatedLinks);
    }
  };
  
  const handleLinkChange = (index, newLink) => {
    if (Array.isArray(previousWorkLinks)) {
      const updatedLinks = [...previousWorkLinks];
      updatedLinks[index] = newLink;
      setPreviousWorkLinks(updatedLinks);
    }
  };

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
  const validateForm = () => {
    const newErrors = {};
  
    if (!name) newErrors.name = 'Name is required';
    if (expertise.length === 0) newErrors.expertise = 'Please select at least one area of expertise';
    if (!experience) newErrors.experience = 'Experience is required';
    if (interests.length === 0) newErrors.interests = 'Please select at least one area of interest';
    if (!talents) newErrors.talents = 'Talents and Hobbies are required';
    if (languages.length === 0) newErrors.languages = 'Please select at least one language';
    if (!timezone) newErrors.timezone = 'Timezone is required';
    if (!description) newErrors.description = 'Description is required';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExpertiseChange = (selectedOption) => {
    if (selectedOption === 'Other') {
      setExpertise(expertise.includes('Other') ? expertise.filter((opt) => opt !== 'Other') : [...expertise, 'Other']);
    } else if (expertise.includes(selectedOption)) {
      setExpertise(expertise.filter((opt) => opt !== selectedOption));
    } else {
      setExpertise([...expertise, selectedOption]);
    }
  };

  const handleInterestsChange = (selectedOption) => {
    if (selectedOption === 'Other') {
      setInterests(interests.includes('Other') ? interests.filter((opt) => opt !== 'Other') : [...interests, 'Other']);
    } else if (interests.includes(selectedOption)) {
      setInterests(interests.filter((opt) => opt !== selectedOption));
    } else {
      setInterests([...interests, selectedOption]);
    }
  };

  const handleLanguagesChange = (selectedOption) => {
    if (languages.includes(selectedOption)) {
      setLanguages(languages.filter((option) => option !== selectedOption));
    } else {
      setLanguages([...languages, selectedOption]);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFileToDrive = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/uploadToDrive', {
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!session) {
      setShowPopup(true);
      return;
    }
  
    if (!validateForm()) return;
  
    try {
      // Display loading state
      toast.info('Submitting your form...', {
        position: 'top-center',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      });
  
      // Upload file to Google Drive
      if (selectedFile) {
        await uploadFileToDrive(selectedFile);
      }

      // Retrieve the Discord username from the session data
      const discordUsername = session?.user?.name || '';
  
      // Collect all the form data into an object
      const formData = {
        name,
        expertise: expertise.includes('Other') ? [...expertise.filter((e) => e !== 'Other'), otherExpertise] : expertise,
        interests: interests.includes('Other') ? [...interests.filter((i) => i !== 'Other'), otherInterests] : interests,
        experience, // Make sure this field is included and filled
        talents,
        languages,
        timezone,
        description,
        email,
        discord,
        twitter,
        linkedin,
        discordUsername, // New field
        previousWorkLinks: previousWorkLinks.filter(link => link !== '') // Only non-empty links
      };
  
      // Use fetch to send the form data to your API route
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Form data successfully submitted:', result);
        toast.dismiss();
        toast.success('Form submitted successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });

        // Clear form fields
        setName('');
        setOtherExpertise('');
        setOtherInterests('');
        setExpertise([]);
        setExperience('');
        setInterests([]);
        setTalents('');
        setLanguages([]);
        setTimezone('');
        setDescription('');
        setDiscord('');
        setEmail('');
        setTwitter('');
        setLinkedin('');
        setSelectedFile(null);
        setPreviousWorkLinks(['']); // Reset to only one empty field
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      toast.dismiss();
      toast.error('Failed to submit form. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  return (
    <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
      <header className="flex justify-between items-center p-4 border-b border-gray-700 backdrop-blur-md bg-opacity-30">
      <Head>
        <title>JUPRecruit</title>
        <link rel="icon" href="/catt.ico" />
      </Head>
      <Link href="/">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image src="/cattlogo.jpg" alt="Logo" width={48} height={48} className="object-cover" />
          </div>
        </Link>
        <nav>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => signIn('discord')}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <FaDiscord className="mr-2" />
              Login with Discord
            </button>
            <button
              onClick={() => signIn('twitter')}
              className="px-4 py-2 rounded-md bg-blue-400 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 flex items-center"
            >
              <FaTwitter className="mr-2" />
              Login with Twitter
            </button>
          </div>
        )}
      </nav>
      </header>
      {!session && (
        <div className="max-w-[600px] mx-auto mt-[96px] p-6 rounded-xl px-4 py-2.5 flex items-center justify-center space-x-2 text-jupiter-red text-sm font-semibold border border-warning/20 bg-warning/5 disabled:opacity-40 enabled:hover:bg-v2-primary/10 transition duration-300">
          You are required to link your Discord to fill up the form.
        </div>
      )}

            {/* Modal for Expertise Selection */}
        <Modal
        isOpen={showExpertiseModal}
        onClose={() => setShowExpertiseModal(false)}
        title="Select Expertise"
        options={ExpertiseOptions}
        selectedOptions={expertise}
        onOptionChange={handleExpertiseChange}
      />

      {/* Modal for Interests Selection */}
      <Modal
        isOpen={showInterestsModal}
        onClose={() => setShowInterestsModal(false)}
        title="Select Interests"
        options={InterestOptions}
        selectedOptions={interests}
        onOptionChange={handleInterestsChange}
      />

      {/* Modal for Languages Selection */}
      <Modal
        isOpen={showLanguagesModal}
        onClose={() => setShowLanguagesModal(false)}
        title="Select Languages"
        options={LanguageOptions}
        selectedOptions={languages}
        onOptionChange={handleLanguagesChange}
      />

      <div className="max-w-[600px] mx-auto mt-4 p-20 rounded-xl bg-[#1B2229]">
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#00BEE0] to-[#C7F284] text-transparent bg-clip-text">
          Talent Profile Form
        </h2>
        
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!session}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          <div>
          <label htmlFor="expertise" className="text-sm text-v2-lily/50 font-medium">Areas of Expertise</label>
          <div className="mt-1">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md flex items-center justify-center space-x-1 text-v2-lily text-xs font-semibold border border-v2-lily/20 bg-v2-lily/5 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-v2-lily/10 transition duration-300"
            onClick={() => setShowExpertiseModal(true)}
            disabled={!session}
          >
            Select Expertise
          </button>
            {errors.expertise && <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {expertise.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {option}
                  <button
                    type="button"
                    className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                    onClick={() => handleExpertiseChange(option)}
                  >
                    <span className="sr-only">Remove {option}</span>
                    <FaTimes className="h-2 w-2" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          {expertise.includes('Other') && (
            <div className="mt-2">
            <label htmlFor="other-expertise" className="text-sm font-medium text-gray-300">Other Expertise</label>
            <input
              type="text"
              id="other-expertise"
              value={otherExpertise}
              onChange={(e) => setOtherExpertise(e.target.value)}
              placeholder="Enter your expertise"
              className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          )}
        </div>

          <div>
            <label htmlFor="experience" className="text-sm text-v2-lily/50 font-medium">
              Experience
            </label>
            <div className="mt-1">
              <select
                name="experience"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!session}
              >
                <option value="">Select experience</option>
                {ExperienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>
          </div>

          <div>
          <label htmlFor="interests" className="text-sm text-v2-lily/50 font-medium0">Areas of Interest</label>
          <div className="mt-1">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md flex items-center justify-center space-x-1 text-v2-lily text-xs font-semibold border border-v2-lily/20 bg-v2-lily/5 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-v2-lily/10 transition duration-300"
            onClick={() => setShowInterestsModal(true)}
            disabled={!session}
          >
            Select Interests
          </button>
            {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {option}
                  <button
                    type="button"
                    className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                    onClick={() => handleInterestsChange(option)}
                  >
                    <span className="sr-only">Remove {option}</span>
                    <FaTimes className="h-2 w-2" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          {interests.includes('Other') && (
            <div className="mt-2">
            <label htmlFor="other-interests" className="text-sm font-medium text-gray-300">Other Interests</label>
            <input
              type="text"
              id="other-interests"
              value={otherInterests}
              onChange={(e) => setOtherInterests(e.target.value)}
              placeholder="Enter your interests"
              className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          )}
        </div>

          <div>
            <label htmlFor="talents" className="text-sm text-v2-lily/50 font-medium">
              Talents and Hobbies
            </label>
            <div className="mt-1">
            <input
              type="text"
              name="talents"
              id="talents"
              value={talents}
              onChange={(e) => setTalents(e.target.value)}
              className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!session}
            />
            {errors.talents && <p className="text-red-500 text-sm mt-1">{errors.talents}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="languages" className="text-sm text-v2-lily/50 font-medium">
              Languages
            </label>
            <div className="mt-1">
            <button
            type="button"
            className="px-3 py-1.5 rounded-md flex items-center justify-center space-x-1 text-v2-lily text-xs font-semibold border border-v2-lily/20 bg-v2-lily/5 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-v2-lily/10 transition duration-300"
            onClick={() => setShowLanguagesModal(true)}
            disabled={!session}
          >
            Select Languages
          </button>
          {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {languages.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {option}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white "
                      onClick={() => handleLanguagesChange(option)}
                    >
                      <span className="sr-only">Remove {option}</span>
                      <FaTimes className="h-2 w-2" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="timezone" className="text-sm text-v2-lily/50 font-medium">
              Timezone
            </label>
            <div className="mt-1">
            <select
            name="timezone"
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!session}
          >
            <option value="">Select timezone</option>
            {TimezoneOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.timezone && <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-sm text-v2-lily/50 font-medium">
              Description / Introduction
            </label>
            <div className="mt-1">
            <textarea
              name="description"
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!session}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="socials" className="block text-sm font-medium text-gray-300">
              Socials
            </label>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
              <FaEnvelope className="text-xl text-indigo-500" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-2 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!session}
              />
            </div>
              <div className="flex items-center">
              <FaTwitter className="text-xl text-blue-500" />
              <input
                type="text"
                name="twitter"
                id="twitter"
                placeholder={session?.user?.image?.includes('twimg.com') ? session?.user?.name : 'Twitter'}
                value={session?.user?.image?.includes('twimg.com') ? session?.user?.name : twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="ml-2 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={session?.user?.image?.includes('twimg.com') || !session}
              />
              </div>
              <div className="flex items-center">
                <FaLinkedin className="text-xl text-blue-600" />
                <input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  placeholder="LinkedIn"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="ml-2 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!session}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="previousWorkLinks" className="block text-sm font-medium text-gray-300">
              Links to Previous Work (optional)
            </label>
            <div className="mt-1 space-y-4">
              {Array.isArray(previousWorkLinks) && previousWorkLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    placeholder={`Link ${index + 1}`}
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={!session}
                  />
                  {index >= 1 && (
                    <button
                      type="button"
                      className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                      onClick={() => removeLinkField(index)}
                      disabled={!session}
                    >
                      <FaTimes />
                    </button>
                  )}
                  {index === previousWorkLinks.length - 1 && previousWorkLinks.length < 3 && (
                    <button
                    type="button"
                    className="p-2 bg-indigo-600 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700"
                    onClick={addNewLinkField}
                    disabled={!session}
                  >
                    <FaPlus />
                  </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr class="w-full h-[1px] bg-v2-lily-5 border-none"></hr>

          <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-1">
          </label>
          <div
            {...getRootProps()}
            role="presentation"
            className={`p-6 rounded-xl border-2 border-v2-lily-5 bg-v2-lily-5 flex flex-col items-center ${
              isDragActive ? 'opacity-100' : 'opacity-30'
            } ${!session ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
          <input {...getInputProps()} disabled={!session} />
            {!selectedFile ? (
              <>
                <FaUpload className="text-4xl text-v2-lily mb-2" />
                <p className="mt-3 text-center text-v2-lily/75 text-sm">
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
          {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-v2-primary px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 text-[#475C26] text-xl font-bold border border-v2-primary/20  enabled:hover:bg-v2-primary/10 transition duration-300 flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
            // disabled={!selectedFile} || 
            disabled={!session}
          >
            <span>Submit</span>
          </button>
        </div>
        </form>
      </div>
      <SpeedInsights />
      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Login Required</h2>
      <p className="text-gray-300 mb-6">Please log in with Discord to submit the form.</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setShowPopup(false);
            signIn('discord');
          }}
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  };
}