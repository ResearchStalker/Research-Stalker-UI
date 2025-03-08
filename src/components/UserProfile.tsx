import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../service/ApiGatewayService';
import { login, logout } from "../service/AuthService";
import '../styles/components/userProfile.scss';

interface UserProfileProps {
    minimal?: boolean;
    showLoginButton?: boolean;
    activeDropdown?: string | null;
    onDropdownToggle?: (isOpen: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
    minimal = false, 
    showLoginButton = true,
    activeDropdown,
    onDropdownToggle
}) => {
    const [user, setUser] = useState<{ email: string; picture?: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

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

    // Close dropdown if another dropdown is opened
    useEffect(() => {
        if (activeDropdown && activeDropdown !== 'userProfile' && isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    }, [activeDropdown, isDropdownOpen]);

    const toggleDropdown = () => {
        const newState = !isDropdownOpen;
        setIsDropdownOpen(newState);
        if (onDropdownToggle) {
            onDropdownToggle(newState);
        }
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
        if (onDropdownToggle) {
            onDropdownToggle(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            closeDropdown();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
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
                    <div className="user-email">
                        {user.email}
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                        <i className="mdi mdi-logout"></i>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;