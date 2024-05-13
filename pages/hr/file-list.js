// ./pages/storage-explorer.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { supabase } from '../utils/supabaseClient';
import Sidebar from '../components/Sidebar';
import Head from 'next/head';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { requireAdmin } from "../middleware";

export default function StorageExplorer() {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [docxPreviewContent, setDocxPreviewContent] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Error fetching folders:', error);
      } else {
        setFolders(data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFiles = async (folderPath) => {
    try {
      const { data, error } = await supabase.storage.from('juprecruit').list(folderPath);
      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFolderClick = (folderName) => {
    setCurrentFolder(folderName);
    fetchFiles(folderName);
  };

  const handleBack = () => {
    setCurrentFolder('');
    setFiles([]);
  };
  

  const handleFileClick = async (file) => {
    const { data, error } = await supabase.storage.from('juprecruit').download(`${currentFolder}/${file.name}`);
    if (error) {
      console.error('Error downloading file:', error);
    } else {
      const url = URL.createObjectURL(data);
      setPreviewFile({ type: file.metadata.mimetype, url });

      if (file.metadata.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxContent = await renderDocxPreview(file);
        setDocxPreviewContent(docxContent);
      }
    }
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('preview-overlay')) {
      handleClosePreview();
    }
  };

  const handleDownload = async (file) => {
    const { data, error } = await supabase.storage.from('juprecruit').download(`${currentFolder}/${file.name}`);
    if (error) {
      console.error('Error downloading file:', error);
    } else {
      saveAs(data, file.name);
    }
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    if (fileToDelete) {
      try {
        const { error } = await supabase.storage.from('juprecruit').remove([`${currentFolder}/${fileToDelete.name}`]);
        if (error) {
          console.error('Error deleting file:', error);
        } else {
          setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToDelete.name));
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
      setFileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderDocxPreview = async (file) => {
    const { data, error } = await supabase.storage.from('juprecruit').download(`${currentFolder}/${file.name}`);
    if (error) {
      console.error('Error downloading docx file:', error);
      return 'Error loading docx file.';
    }

    const result = await mammoth.convertToHtml({ arrayBuffer: data });
    return result.value;
  };

  return (
      <div style={{ backgroundColor: 'rgb(19, 24, 29)' }} className={`min-h-screen text-white ${inter.className}`}>
      <Head>
        <title>Storage Explorer | JUPRecruit</title>
        <link rel="icon" href="/catt_logo.ico" />
      </Head>

      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className={`flex-1 ml-16 ${sidebarOpen ? 'ml-64' : ''}`}>
          <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Storage Explorer</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Folders</h2>
                {isLoading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : (
                  <ul className="space-y-2">
                    <li
                      className={`bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-700 transition duration-300 ${
                        currentFolder === 'talentresume' ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleFolderClick('talentresume')}
                    >
                      talentresume
                    </li>
                    <li
                      className={`bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-700 transition duration-300 ${
                        currentFolder === 'workgroupresume' ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleFolderClick('workgroupresume')}
                    >
                      workgroupresume
                    </li>
                  </ul>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {currentFolder ? `Files in ${currentFolder}` : 'Select a folder'}
                  </h2>
                  {currentFolder && (
                    <button
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  )}
                </div>
                {isLoading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : (
                  <ul className="space-y-2">
                    {files.map((file) => (
                      <li key={file.name} className="bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center">
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => handleFileClick(file)}
                        >
                          {file.name}
                        </span>
                        <div>
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2 hover:bg-blue-600 transition duration-300"
                            onClick={() => handleDownload(file)}
                          >
                            Download
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                            onClick={() => handleDeleteClick(file)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {previewFile && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 preview-overlay" onClick={handleOutsideClick}>
    <div className={`relative max-w-4xl w-full mx-auto`} style={{ maxHeight: '90vh' }}>
      {previewFile.type.startsWith('image/') && (
        <div className="relative w-full h-screen">
          <Image
            src={previewFile.url}
            alt="Preview"
            layout="fill"
            objectFit="contain"
          />
          <button
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 hover:bg-gray-600 transition duration-300"
            onClick={handleClosePreview}
          >
            Close
          </button>
        </div>
      )}
      {previewFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
        <div className="bg-white text-black p-8 overflow-auto relative" style={{ width: 'auto', height: '80vh' }}>
          <div dangerouslySetInnerHTML={{ __html: docxPreviewContent }} />
          <button
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 hover:bg-gray-600 transition duration-300"
            onClick={handleClosePreview}
          >
            Close
          </button>
        </div>
      )}
    </div>
  </div>
)}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete the file?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-300"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  return await requireAdmin(context.req, context.res);
}