import { useNavigate } from "react-router-dom";

const apiPath = 'http://localhost:8080/api'

export function TweetsScrollable({ tweets, setTweets = {}}) {
    const navigate = useNavigate();
    console.log(tweets)

    const toggleLike = async (index) => {
        const updatedTweets = [...tweets];
        const tweet = updatedTweets[index];

        // Toggle like status
        if (tweet.liked) {
            tweet.likes_count -= 1; // Decrement likes if unliking
            // Remove like to db
            try {
                const removeLikeResponse = await fetch(`${apiPath}/tweets/${tweet.id}/like`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });

                if (!removeLikeResponse.ok) {
                    const errStr = `Error adding like ${removeLikeResponse.status} - ${removeLikeResponse.statusText}`;
                    console.error(errStr);
                    alert(errStr);
                }
            } catch (error) {
                const errStr = `Error adding like: ${error.message}`;
                console.error(errStr);
                alert(errStr);
            }
        } else {
            tweet.likes_count += 1; // Increment likes if liking
            // Add like to db
            try {
                const addLikeResponse = await fetch(`${apiPath}/tweets/${tweet.id}/like`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });

                if (!addLikeResponse.ok) {
                    const errStr = `Error adding like ${addLikeResponse.status} - ${addLikeResponse.statusText}`;
                    console.error(errStr);
                    alert(errStr);
                }
            } catch (error) {
                const errStr = `Error adding like: ${error.message}`;
                console.error(errStr);
                alert(errStr);
            }
        }
        tweet.liked = !tweet.liked;

        setTweets(updatedTweets);
    };

    return (
        <div style={{ width: "500px" }} className="bg-gray-800 text-white p-4 overflow-y-auto">
            <div className="space-y-5">
                {tweets.map((tweet, i) => (
                    <div
                        className="bg-gray-700 p-3 shadow border-b rounded-lg flex space-x-4"
                        key={tweet.id}
                    >
                        {/* Profile Picture */}
                        <img
                            className="w-10 h-10 rounded-full"
                            src={`${tweet.profile_picture_url}?${new Date().getTime()}`}
                            alt="profile"
                        />
                        {/* Tweet Content */}
                        <div className="flex-1 flex flex-col">
                            <h5 onClick={() => navigate(`/${tweet.username}`)} className="font-bold underline hover:cursor-pointer hover:text-gray-200">@{tweet.username}</h5>
                            <p>{tweet.content}</p>
                            <p className="text-sm text-gray-400">{tweet.created_at}</p>
                            {/* Likes Count */}
                            <p className="text-sm text-gray-300">
                                {tweet.likes_count} {tweet.likes_count === 1 ? "Like" : "Likes"}
                            </p>
                        </div>
                        {/* Like Button */}
                        <button
                            onClick={() => toggleLike(i)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${tweet.liked ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"
                                } hover:scale-110 transform transition-transform`}
                        >
                            {tweet.liked ? "❤️" : "♡"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
