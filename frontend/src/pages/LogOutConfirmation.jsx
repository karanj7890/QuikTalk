import React from 'react';
import { useAuthStore } from '../store/AuthStore';

const LogoutConfirmationPage = () => {
    const { logout } = useAuthStore();
    
    const handleLogout = () => {
        logout();
        // Logic for logging out the user
        console.log("User logged out");
        
    };

    const handleCancel = () => {
        // Logic for canceling the logout
        console.log("Logout canceled");
        window.history.back(); // redirect to the previous page
    };

    return (
        <div className="min-h-screen inset-0 flex items-center justify-center p-4 sm:p-10 backdrop-blur-sm">
            <div className="border-2 border-gray-300 rounded-lg shadow-lg p-4 sm:p-8 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
            <h1 className="text-xl font-bold mb-4 text-center p-2">Logout Confirmation</h1>
            <p className="mb-6 text-center">Are you sure you want to log out?</p>
            <div className="flex justify-between">
                <button onClick={handleLogout} className="btn btn-primary">Yes, Log Out</button>
                <button onClick={handleCancel} className="btn btn-secondary">No, Stay Logged In</button>
            </div>
        </div>
        </div>
    );
};

export default LogoutConfirmationPage;