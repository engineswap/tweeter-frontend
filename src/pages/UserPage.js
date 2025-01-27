import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TweetsScrollable } from '../components/TweetsScrollable';
import { VerticalNavbar } from '../components/NavBar';
import { EditBio } from '../components/EditBio';
import { useNavigate } from 'react-router-dom';

const apiPath = 'https://tweeter-backend-2166.onrender.com/api'; 

export function UserPage() {
    const [userMetaData, setUserMetaData] = useState(null);
    const [tweets, setTweets] = useState([]);
    const [followingFlag, setFollowingFlag] = useState(false);
    const [error, setError] = useState(null);
    const { username } = useParams();
    const navigate = useNavigate();

    const fetchUserMetaData = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(apiPath + '/users/' + username, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                setUserMetaData(jsonResponse);
                setFollowingFlag(jsonResponse.JWTUserFollows);
                console.log(jsonResponse);
            } else if (response.status == 403) {
                // Login again
                navigate('/login');
            } else {
                const errStr = `Error submitting form to backend: ${response.status}\n${response.statusText}`;
                setError(errStr);
            }
        } catch (error) {
            const errStr = `Error loading content: ${error.message}`;
            setError(errStr);
        }
    };

    const fetchTweets = async () => {
        // Load content 
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(apiPath + '/tweets/' + username,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            )
            if (response.ok) {
                const jsonResponse = await response.json();
                setTweets(jsonResponse);
                console.log(jsonResponse);
            } else {
                alert(`Error submitting form to backend: ${response.status}\n${response.statusText}`);
                setError(`Error submitting form to backend: ${response.status}\n${response.statusText}`)
            }
        } catch (error) {
            console.error(`Error loading content: ${error.message}`);
        }
    };

    // Use a effect to load user's data, put it into state
    useEffect(() => {
        fetchUserMetaData();
    }, [username, followingFlag]);

    useEffect(() => {
        fetchTweets();
    }, [username]);

    const toggleFollowing = async () => {
        if (!followingFlag) {
            try {
                const token = localStorage.getItem('jwt');
                const res = await fetch(apiPath + '/users/' + userMetaData.id + '/follow', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    setFollowingFlag(!followingFlag);
                    return;
                } else {
                    const errStr = `Error occuring following user - ${res.status} - ${res.statusText}`;
                    alert(errStr);
                    return;
                }
            } catch (err) {
                const errStr = `Error occuring following user - ${err.message}`;
                alert(errStr);
                return;
            }
        } else {
            try {
                const token = localStorage.getItem('jwt');
                const res = await fetch(apiPath + '/users/' + userMetaData.id + '/follow', {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    setFollowingFlag(!followingFlag);
                    return;
                } else {
                    const errStr = `Error occuring un-following user - ${res.status} - ${res.statusText}`;
                    alert(errStr);
                    return;
                }
            } catch (err) {
                const errStr = `Error occuring un-following user - ${err.message}`;
                alert(errStr);
                return;
            }
        }
    };

    if (error) {
        return (
            <p>Error occured loading data {error}</p>
        )
    }
    if (userMetaData == null) {
        return (
            <div>
                Loading {username}'s page
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            <VerticalNavbar />
            <div className='flex-1 bg-gray-800 flex flex-col items-center h-screen space-y-4'>

                <div className="p-6 bg-gray-800 rounded-md w-96">
                    {/* Profile Picture and Username */}
                    <div className="flex items-center space-x-4 mb-4">
                        <img
                            src={`${userMetaData.profile_picture_url}?${new Date().getTime()}`}
                            alt={`${userMetaData.username}'s profile`}
                            className="w-20 h-20 rounded-full"
                        />
                        <h1 className="text-2xl font-bold text-white">@{userMetaData.username}</h1>
                    </div>

                    {/* Biography */}
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">Biography</h2>
                        <p className="text-gray-300">{userMetaData.biography || 'No biography provided.'}</p>
                    </div>

                    {userMetaData.JWTUserId == userMetaData.id &&
                        <EditBio biography={userMetaData.biography}
                            fetchUserMetaData={fetchUserMetaData}
                            fetchTweets={fetchTweets}
                        />
                    }

                    {/* Stats */}
                    <div className="flex justify-between text-center text-sm text-gray-300">
                        <div>
                            <p className="font-bold text-white">{userMetaData.followers}</p>
                            <p>Followers</p>
                        </div>
                        <div>
                            <p className="font-bold text-white">{userMetaData.following}</p>
                            <p>Following</p>
                        </div>
                    </div>

                    {userMetaData.JWTUserId !== userMetaData.id && <button className={`text-white p-2 rounded-md mt-4 cursor-pointer ${followingFlag ? "bg-blue-800 hover:bg-blue-900" : "bg-blue-400 hover:bg-blue-500"
                        }`}
                        onClick={toggleFollowing}>
                        {followingFlag ? "Following" : "Follow"}
                    </button>}

                    {/* Created At */}
                    <div className="mt-6 text-sm text-gray-400">
                        <p>Joined on {new Date(userMetaData.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="w-full mx-auto mt-6 flex justify-center">
                    <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                        <TweetsScrollable tweets={tweets} setTweets={setTweets} />
                    </div>
                </div>
            </div>
        </div>
    );
}
