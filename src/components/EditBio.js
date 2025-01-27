import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb in bytes

const apiPath = 'https://tweeter-backend-2166.onrender.com/api'; 

export function EditBio({ biography, fetchUserMetaData, fetchTweets }) {
    const [editBioModalOpen, setEditBioModalOpen] = useState(false);
    const [bioState, setBioState] = useState(biography == null ? "" : biography);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("jwt");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                alert("File size cannot exceed 5mb");
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleProfilePicUpload = async () => {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = async () => {
                const base64File = reader.result.split(',')[1];

                const base64Size = Math.floor((base64File.length * 3) / 4); // Base64 overhead calculation
                console.log(`File size before Base64: ${selectedFile.size} bytes`);
                console.log(`File size after Base64: ${base64File.length} bytes`);

                try {
                    const res = await fetch(apiPath + '/users/updateProfilePicture', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        },
                        body: JSON.stringify({
                            fileName: selectedFile.name,
                            fileType: selectedFile.type,
                            fileData: base64File
                        })
                    })

                    if (!res.ok) {
                        const errStr = `${res.status} - ${res.statusText}`;
                        console.error(errStr);
                        alert(errStr);
                    } else {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        alert("Updated successfully")
                    }
                } catch (e) {
                    const errStr = `Failed to upload file: ${e.message}`;
                    console.error(errStr);
                    alert(errStr);
                }
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    const toggleModal = async () => {
        if (editBioModalOpen) {
            // Update bio
            try {
                const response = await fetch(apiPath + '/users/updateBiography', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ 'biography': bioState })
                })
                if (response.ok) {
                    setEditBioModalOpen(!editBioModalOpen);
                    fetchUserMetaData(); // Reload bio
                    fetchTweets();
                } else if (response.status == 403) {
                    // Login again
                    navigate('/login');
                } else {
                    const errStr = `Error submitting form to backend: ${response.status}\n${response.statusText}`;
                    alert(errStr);
                }
            } catch (e) {
                const errStr = `Error with updating bio: ${e.message}`;
                console.error(errStr);
                alert(errStr);
            }

        } else {
            setEditBioModalOpen(!editBioModalOpen);
        }
    };

    return (
        <div>
            {/* Button to open modal */}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleModal}
            >
                Edit profile
            </button>

            {/* Modal */}
            {editBioModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">Edit biography</h2>
                        <textarea rows={3} value={bioState} onChange={(e) => setBioState(e.target.value)} className=" p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                        <h2 className="text-xl font-bold mb-4">Edit profile picture</h2>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange}></input>
                        <div className='w-full mt-3'>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleProfilePicUpload}
                            >
                                Upload
                            </button>
                        </div>

                        <button
                            className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={toggleModal}
                        >
                            Save and close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
