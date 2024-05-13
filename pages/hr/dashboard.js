import { Inter } from "next/font/google";
import Head from 'next/head';
import { useState, useEffect } from 'react';
const inter = Inter({ subsets: ["latin"] });
import { useSession, getSession } from 'next-auth/react';
import { FaUserCircle, FaChartBar, FaUsers, FaBriefcase, FaChartPie } from 'react-icons/fa';
import { supabase } from '../../utils/supabaseClient';
import Sidebar from '../components/Sidebar';  // Adjust path as necessary
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8c00', '#ff0080'];
const LanguageOptions = ['English', 'Chinese', 'Russian', 'Japanese', 'Indonesian', 'Turkish', 'Persian', 'Vietnamese', 'French', 'Spanish', 'Italian', 'Portuguese', 'Indian', 'German', 'Filipino', 'Arabic'];
const ExperienceOptions = ['0-2 years', '2-5 years', '5-10 years', '10+ years'];
const ExpertiseOptions = ['Business Development', 'Business Intelligence & Data Science', 'AI & Machine Learning', 'IT & Cybersecurity', 'Accounting & Finance', 'Web2/Web3 Development', 'Administration & Human Resources', 'Graphic Design & Media Productions', 'Sales & Marketing', 'Communications & PR', 'Customer Service', 'Logitics & Operations', 'Legal & Compliance', 'Medical, Health & Safety', 'Project & Product Management', 'Other'];
const TimezoneOptions = ['UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [talentRecruits, setTalentRecruits] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [expertiseData, setExpertiseData] = useState([]);
  const [timezoneData, setTimezoneData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('expertise');  // Set default to 'expertise'

  useEffect(() => {
    const fetchTalentRecruitsCount = async () => {
      try {
        const { count, error } = await supabase
          .from('talent_recruits')
          .select('*', { count: 'exact', head: true });

        if (error) {
          throw error;
        }

        setTalentRecruits({ total_recruits: count });
      } catch (error) {
        console.error('Error fetching talent recruits count:', error);
      }
    };

    const fetchJobApplications = async () => {
      try {
        const { count, error } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true });

        if (error) {
          throw error;
        }

        setJobApplications({ total_applications: count });
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const { data: talentRecruits, error: talentRecruitsError } = await supabase
          .from('talent_recruits')
          .select('name, logged_username, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: jobApplications, error: jobApplicationsError } = await supabase
          .from('job_applications')
          .select('name, username, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (talentRecruitsError || jobApplicationsError) {
          throw new Error('Error fetching recent activity');
        }

        const combinedActivity = [...talentRecruits, ...jobApplications];
        combinedActivity.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setRecentActivity(combinedActivity);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };
    const fetchStats = async () => {
      try {
        const { data: talentRecruits, error } = await supabase
          .from('talent_recruits')
          .select('languages, experience, expertise, timezone');

        if (error) {
          throw error;
        }

        const languageCounts = LanguageOptions.reduce((counts, language) => {
          const count = talentRecruits.filter(recruit => recruit.languages.includes(language)).length;
          if (count > 0) {
            counts[language] = count;
          }
          return counts;
        }, {});
        const languageData = Object.entries(languageCounts).map(([name, value]) => ({ name, value }));
        setLanguageData(languageData);
        
        // Process experience data
        const experienceCounts = ExperienceOptions.reduce((counts, experience) => {
          const count = talentRecruits.filter(recruit => recruit.experience === experience).length;
          if (count > 0) {
            counts[experience] = count;
          }
          return counts;
        }, {});
        const experienceData = Object.entries(experienceCounts).map(([name, value]) => ({ name, value }));
        setExperienceData(experienceData);
        
        // Process expertise data
        const expertiseCounts = ExpertiseOptions.reduce((counts, expertise) => {
          const count = talentRecruits.filter(recruit => recruit.expertise.includes(expertise)).length;
          if (count > 0) {
            counts[expertise] = count;
          }
          return counts;
        }, {});
        const expertiseData = Object.entries(expertiseCounts).map(([name, value]) => ({ name, value }));
        setExpertiseData(expertiseData);
        
        // Process timezone data
        const timezoneCounts = TimezoneOptions.reduce((counts, timezone) => {
          const count = talentRecruits.filter(recruit => recruit.timezone === timezone).length;
          if (count > 0) {
            counts[timezone] = count;
          }
          return counts;
        }, {});
        const timezoneData = Object.entries(timezoneCounts).map(([name, value]) => ({ name, value }));
        setTimezoneData(timezoneData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    fetchRecentActivity();
    fetchJobApplications();
    fetchTalentRecruitsCount();
  }, []);

  const formatTimestamp = (timestamp) => {
    const currentTime = new Date();
    const activityTime = new Date(timestamp);
    const timeDiff = currentTime - activityTime;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));

    if (hours === 0) {
      const minutes = Math.floor(timeDiff / (1000 * 60));
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'language':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-blue-400" />
              Language Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="name" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'experience':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaChartPie className="mr-2 text-green-400" />
              Experience Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={experienceData}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {experienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'expertise':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaChartPie className="mr-2 text-purple-400" />
              Expertise Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expertiseData}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expertiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'timezone':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-yellow-400" />
              Timezone Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timezoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="name" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                <Legend />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
      <Head>
        <title>Admin Dashboard | JUPRecruit</title>
        <link rel="icon" href="/catt_logo.ico" />
      </Head>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />


        {/* Main Content */}
        <div className={`flex-1 ml-16 ${sidebarOpen ? 'ml-64' : ''}`}>
          <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Talent Recruits */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Talent Recruits</h2>
                <p className="text-gray-400">Total Recruits</p>
              </div>
              <FaUsers className="text-4xl text-indigo-400" />
            </div>
            <p className="text-4xl font-bold">{talentRecruits.total_recruits || 0}</p>
          </div>

              {/* Job Applications */}
              <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Job Applications</h2>
                  <p className="text-gray-400">Total Applications</p>
                </div>
                <FaBriefcase className="text-4xl text-purple-400" />
              </div>
              <p className="text-4xl font-bold">{jobApplications.total_applications || 0}</p>
            </div>


              {/* Pending Applications */}
              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Pending Applications</h2>
                    <p className="text-gray-400">Applications to Review</p>
                  </div>
                  <FaBriefcase className="text-4xl text-yellow-400" />
                </div>
                <p className="text-4xl font-bold">0</p>
              </div>

              {/* Filled Positions */}
              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Filled Positions</h2>
                    <p className="text-gray-400">Positions Filled</p>
                  </div>
                  <FaUserCircle className="text-4xl text-green-400" />
                </div>
                <p className="text-4xl font-bold">0</p>
              </div>
            </div>

            {/* Chart Dropdown */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-10"></h2>
              <select
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option value="expertise">Expertise Distribution</option>
                <option value="experience">Experience Distribution</option>
                <option value="language">Language Distribution</option>
                <option value="timezone">Timezone Distribution</option>
              </select>
            </div>
            {renderChart()}

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              {recentActivity.map((activity, index) => (
                <li key={index} className="bg-gray-800 rounded-lg shadow p-4">
                  {activity.logged_username ? (
                    <p className="text-lg">New Talent Recruit: {activity.logged_username}</p>
                  ) : (
                    <p className="text-lg">Workgroup Application Submitted: {activity.username}</p>
                  )}
                  <p className="text-gray-400">{formatTimestamp(activity.created_at)}</p>
                </li>
              ))}
            </ul>
          </div>
          </main>
        </div>
      </div>

    </div>
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