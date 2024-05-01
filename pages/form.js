import { useState } from 'react';
import { Inter } from 'next/font/google';
import { FaDiscord, FaTwitter, FaLinkedin, FaUpload, FaTimes } from 'react-icons/fa';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider, useSession, signIn } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

const ExpertiseOptions = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',
  'Blockchain',
  'Cloud Computing',
  'Cybersecurity'
];

const ExperienceOptions = ['0-2 years', '2-5 years', '5-10 years', '10+ years'];

const InterestOptions = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'DevOps',
  'Artificial Intelligence'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);

  const handleExpertiseChange = (selectedOption) => {
    if (expertise.includes(selectedOption)) {
      setExpertise(expertise.filter((option) => option !== selectedOption));
    } else {
      setExpertise([...expertise, selectedOption]);
    }
  };

  const handleInterestsChange = (selectedOption) => {
    if (interests.includes(selectedOption)) {
      setInterests(interests.filter((option) => option !== selectedOption));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
        setShowPopup(true);
        return;
      }
  
    // Collect all the form data into an object
    const formData = {
      name,
      expertise,
      experience,
      interests,
      talents,
      languages,
      timezone,
      description,
      discord,
      twitter,
      linkedin
    };
  
    // Use fetch to send the form data to your API route
    try {
      const response = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: formData })
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Form data successfully submitted:', result);
        alert('Form submitted successfully!'); // or handle the success case in a more user-friendly way
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form.'); // or display the error message on the UI
    }
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
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
            onClick={() => signIn('discord')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
            <FaDiscord className="mr-2" />
            Login with Discord
            </button>
          )}
        </nav>
      </header>

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

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-300">
              Areas of Expertise
            </label>
            <div className="mt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowExpertiseModal(true)}
              >
                Select Expertise
              </button>
              <div className="mt-2 flex flex-wrap gap-2">
                {expertise.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {option}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                      onClick={() => handleExpertiseChange(option)}
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
            <label htmlFor="experience" className="block text-sm font-medium text-gray-300">
              Experience
            </label>
            <div className="mt-1">
              <select
                name="experience"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
              >
                <option value="">Select experience</option>
                {ExperienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-300">
              Areas of Interest
            </label>
            <div className="mt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowInterestsModal(true)}
              >
                Select Interests
              </button>
              <div className="mt-2 flex flex-wrap gap-2">
                {interests.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {option}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                      onClick={() => handleInterestsChange(option)}
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
            <label htmlFor="talents" className="block text-sm font-medium text-gray-300">
              Talents/Hobbies
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="talents"
                id="talents"
                value={talents}
                onChange={(e) => setTalents(e.target.value)}
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="languages" className="block text-sm font-medium text-gray-300">
              Languages
            </label>
            <div className="mt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowLanguagesModal(true)}
              >
                Select Languages
              </button>
              <div className="mt-2 flex flex-wrap gap-2">
                {languages.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {option}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
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
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-300">
              Timezone
            </label>
            <div className="mt-1">
              <select
                name="timezone"
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
              >
                <option value="">Select timezone</option>
                {TimezoneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description/Introduction
            </label>
            <div className="mt-1">
              <textarea
                name="description"
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label htmlFor="socials" className="block text-sm font-medium text-gray-300">
              Socials
            </label>
            <div className="mt-1 flex space-x-4">
              <div className="flex items-center">
                <FaDiscord className="text-xl text-indigo-500" />
                <input
                  type="text"
                  name="discord"
                  id="discord"
                  placeholder="Discord"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  className="ml-2 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                />
              </div>
              <div className="flex items-center">
                <FaTwitter className="text-xl text-blue-500" />
                <input
                  type="text"
                  name="twitter"
                  id="twitter"
                  placeholder="Twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="ml-2 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
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
                  className="ml-2 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-300">
              Upload your resume/CV/portfolio
            </label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span className="flex items-center py-2 px-4">
                  <FaUpload className="mr-2" />
                  {selectedFile ? selectedFile.name : 'Choose file'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-center items-center">
            <button
                type="submit"
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Submit
            </button>
            </div>
          </div>
        </form>
      </div>
      <footer className="text-center p-5 border-t border-gray-700 backdrop-blur-md bg-opacity-30 bg-black">
        © 2024 JupRecruit Team.
      </footer>
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
    </div>
  );
}