import { useNavigate } from "react-router-dom";

export function UsersScrollable({ users }) {
    const navigate = useNavigate();
    return (
        <div style={{ width: "500px" }} className="bg-gray-800 text-white p-4 overflow-y-auto space-y-5">
            {users.map((user, i) => (
                <div className="bg-gray-700 p-3 shadow border-b rounded-lg flex space-x-4" key={user.id}>
                    {/* Add your user details here */}
                    <img
                        className="w-10 h-10 rounded-full"
                        src={`${user.profile_picture_url}?${new Date().getTime()}`}
                        alt="profile"
                    />

                    <div className="flex-1 flex flex-col">
                            <h5 onClick={() => navigate(`/${user.username}`)} className="font-bold underline hover:cursor-pointer hover:text-gray-200">@{user.username}</h5>
                            <p>{user.biography}</p>
                        </div>
  

                </div>
            ))}
        </div>
    );
}
