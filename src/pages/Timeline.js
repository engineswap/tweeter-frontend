import React, { useState, useEffect } from 'react'
import { VerticalNavbar } from '../components/NavBar';
import { TweetsScrollable } from '../components/TweetsScrollable';
import { MakeTweet } from '../components/MakeTweet';
import { useNavigate } from 'react-router-dom';

const apiPath = 'https://tweeter-backend-2166.onrender.com/api'; 

export function Timeline() {
    const [tweets, setTweets] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchTimeline = async () => {
        // Load content 
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(apiPath + '/tweets/timeline',
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
            } else if (response.status == 403) {
                navigate('/login');
            } else {
                alert(`Error submitting form to backend: ${response.status}\n${response.statusText}`);
                setError(`Error submitting form to backend: ${response.status}\n${response.statusText}`)
            }
        } catch (error) {
            console.error(`Error loading content: ${error.message}`);
        }
    }

    //useEffect loads content for components on starting
    useEffect(() => {
        fetchTimeline();
    }, []);

    // if (tweets.length == 0) {
    //     return (
    //         <p>Loading timeline</p>
    //     )
    // }

    if (error) {
        return (
            <p>Error occured loading tweets {error}</p>
        )
    }

    return (
        <div className="flex h-screen">
            <VerticalNavbar />
            <div className='flex-1 flex justify-center bg-gray-800'>
                <TweetsScrollable tweets={tweets} setTweets={setTweets} />
                <MakeTweet reloadTweets={fetchTimeline} />
            </div>
        </div>
    )
}
