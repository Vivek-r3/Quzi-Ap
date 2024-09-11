'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signInWithEmailAndPassword, googleProvider } from '../firebase'; // Adjust the path as needed
import { FaAngleLeft } from 'react-icons/fa6';
import { signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
	const router = useRouter();

	const [user, setUser] = React.useState({
		email: '',
		password: '',
	});

	const [buttonDisabled, setButtonDisabled] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');

	const onLogin = async () => {
		setError(''); // Clear previous errors
		try {
			setLoading(true);
			const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
			
			// Check if email is verified
			if (!userCredential.user.emailVerified) {
				setError('Please verify your email address before logging in.');
				console.log('Email not verified');
				return;
			}

			console.log('Login successful');
			router.push('/');
		} catch (error) {
			if (error instanceof Error) {
				setError('Invalid email or password. Please try again.');
				console.log('Login failed', error.message);
			} else {
				console.log('An unexpected error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	const onGoogleLogin = async () => {
		setError(''); // Clear previous errors
		try {
			setLoading(true);
			const userCredential = await signInWithPopup(auth, googleProvider);

			if (!userCredential.user.emailVerified) {
				setError('Please verify your email address before logging in.');
				console.log('Email not verified');
				return;
			}

			console.log('Google login successful');
			router.push('/');
		} catch (error) {
			if (error instanceof Error) {
				setError('Failed to login with Google. Please try again.');
				console.log('Google login failed', error.message);
			} else {
				console.log('An unexpected error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user.email.length > 0 && user.password.length > 0) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user]);

	console.log(user);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="py-10 mb-10 text-5xl">
				{loading ? "We're logging you in..." : 'Account Login'}
			</h1>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="email"
				type="text"
				value={user.email}
				onChange={(e) => setUser({ ...user, email: e.target.value })}
				placeholder="Your email..."
			/>

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="password"
				type="password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				placeholder="Your Password..."
			/>

			<button
				onClick={onLogin}
				disabled={buttonDisabled || loading}
				className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold">
				{loading ? 'Logging in...' : 'Login'}
			</button>

			<button
				onClick={onGoogleLogin}
				disabled={loading}
				className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold bg-red-500 text-white">
				{loading ? 'Logging in with Google...' : 'Login with Google'}
			</button>

			<Link href="/sign-up">
				<p className="mt-10">
					Do not have an account yet?
					<span className="font-bold text-green-600 ml-2 cursor-pointer underline">
						Register your free account now
					</span>
				</p>
			</Link>

			<Link href="/">
				<p className="mt-8 opacity-50">
					<FaAngleLeft className="inline mr-1" /> Back to the Homepage
				</p>
			</Link>
		</div>
	);
}