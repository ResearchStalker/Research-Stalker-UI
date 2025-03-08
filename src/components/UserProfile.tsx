import React, { useState, useEffect } from 'react';
import { getUser } from '../service/ApiGatewayService';
import { login, logout } from "../service/AuthService";
import '../styles/components/userProfile.scss';

interface UserProfileProps {
    minimal?: boolean;
    showLoginButton?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ minimal = false, showLoginButton = true }) => {
    const [user, setUser] = useState<{ email: string; picture?: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUser();
                setUser({ email: userData.email, picture: userData.picture });
            } catch (error) {
                setUser(null);
            }
        };

        fetchData();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-profile-container')) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user && showLoginButton) {
        return (
            <button className="login-button" onClick={login}>
                <i className="mdi mdi-login"></i>
                {!minimal && <span>Sign In</span>}
            </button>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile" onClick={toggleDropdown}>
                {user.picture ? (
                    <img src={user.picture} alt="User" className="user-avatar" />
                ) : (
                    <div className="user-avatar-placeholder">
                        <i className="mdi mdi-account"></i>
                    </div>
                )}
            </div>

            {isDropdownOpen && (
                <div className="user-dropdown">
                    <button className="dropdown-item" onClick={logout}>
                        <i className="mdi mdi-logout"></i>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;