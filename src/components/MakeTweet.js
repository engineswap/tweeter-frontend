import React, { useState, useEffect } from 'react'; 

const apiPath = 'http://localhost:8080/api'

export function MakeTweet({reloadTweets}) {
    const [tweetContent, setTweetContent] = useState("");
    
    const handleChange = (event) => {
        setTweetContent(event.target.value)
    };

    const submitTweet = async () => {
        if (tweetContent.length>280){
            return alert("Tweet content too long");
        }

        // Make request
        const response = await fetch(apiPath+'/tweets', {
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({content:tweetContent, isReply:false}) 
        });

        if(response.ok){
            setTweetContent("");
            // Reload tweets 
            reloadTweets();
        }else{
            alert(`Error occured submitting your tweet\n${response.status}\n${response.message}`)
        }
    }

    return (
        <div className="w-96 bg-gray-800 text-white p-4">
            {/* Header */}
            <h2 className="text-xl font-bold mb-4">Create Tweet</h2>

            {/* Input Area */}
            <textarea
                className="w-full h-24 p-2 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's happening?"
                maxLength={280}
                onChange={handleChange}
                value = {tweetContent}
            ></textarea>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4">
                {/* Character Counter */}
                <span className="text-sm text-gray-400">{tweetContent.length||0}/280</span>

                {/* Submit Button */}
                <button onClick={submitTweet} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    Tweet
                </button>
            </div>
        </div>
    );
}
