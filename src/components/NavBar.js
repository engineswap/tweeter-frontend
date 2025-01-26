import { Link } from 'react-router-dom';

export function VerticalNavbar() {
    const logout = async () => {
        localStorage.clear();
        // Kick back to login
        window.location.href = 'login';
    };
    return (
        <div className="h-screen w-24 bg-gray-800 text-white flex flex-col">
            {/* Logo/Brand */}
            <div className="p-4 text-xl font-bold border-b border-gray-700">
                Tweeter
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-4">
                <Link
                    to="/"
                    className="block px-4 py-2 rounded hover:bg-gray-700"
                >
                    Timeline
                </Link>
                <Link
                    to="/search"
                    className="block px-4 py-2 rounded hover:bg-gray-700"
                >
                    Search
                </Link>
                <Link
                    to={`/${localStorage.getItem('username')}`}
                    className="block px-4 py-2 rounded hover:bg-gray-700"
                >
                    Profile 
                </Link>

            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <p onClick={logout} className="text-sm text-gray-400 hover:underline">
                    Logout
                </p>
            </div>
        </div>
    );
}
