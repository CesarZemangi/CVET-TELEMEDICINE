// src/utils/auth.js

export const handleLogout = (navigate) => {
    // 1. Clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');

    // 2. Redirect using React Router (if navigate is provided)
    if (navigate) {
        navigate('/login');
    } else {
        window.location.href = '/login';
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};