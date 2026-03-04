import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({
	children,
	allowedRoles = [],
	redirectTo = '/login',
	unauthorizedPath = '/'
}) => {
	const { isAuthenticated, user, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	if (
		allowedRoles.length > 0 &&
		(!user?.role || !allowedRoles.includes(user.role))
	) {
		return <Navigate to={unauthorizedPath} replace />;
	}

	return children;
};

export default ProtectedRoute;
