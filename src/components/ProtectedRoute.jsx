import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function normalizeRole(role) {
	const value = String(role || '').trim().toLowerCase();
	if (value === 'employer') return 'employer';
	if (value === 'admin' || value === 'super admin' || value === 'superadmin') return 'admin';
	return 'student';
}

function getRoleHome(role) {
	const normalized = normalizeRole(role);
	if (normalized === 'employer') return '/dashboard';
	if (normalized === 'admin') return '/admin/dashboard';
	return '/profile';
}

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

	const currentRole = normalizeRole(user?.role);
	const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));
	const isRoleAllowed = normalizedAllowedRoles.length === 0 || normalizedAllowedRoles.includes(currentRole);

	if (!isRoleAllowed) {
		const fallbackPath = unauthorizedPath === '/' ? getRoleHome(user?.role) : unauthorizedPath;
		return <Navigate to={fallbackPath} replace />;
	}

	return children;
};

export default ProtectedRoute;
