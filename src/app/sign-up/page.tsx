'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, createUserWithEmailAndPassword, db, googleProvider } from '../firebase'; // Make sure the path is correct
import { FaAngleLeft } from 'react-icons/fa6';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, UserCredential, sendEmailVerification } from 'firebase/auth';

export default function SignUpPage() {
    const router = useRouter();

    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: '',
        role: 'candidate', // Default role
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const onSignUp = async () => {
        setError(''); // Clear previous errors
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const userId = userCredential.user.uid;

            // Store user information and role in Firestore
            await setDoc(doc(db, 'users', userId), {
                username: user.username,
                email: user.email,
                role: user.role,
            });

            // Send email verification
            await sendEmailVerification(userCredential.user);

            console.log('Sign-up successful. Verification email sent.');
            router.push('/login');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message); // Display the error message
                console.log('Failed to sign up the user', error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignUp = async () => {
        setError(''); // Clear previous errors
        try {
            setLoading(true);
            const userCredential = await signInWithPopup(auth, googleProvider);

            if (!userCredential) {
                throw new Error("Failed to obtain user credentials from Google sign-in.");
            }

            await authenticateUser(userCredential); // Authenticate the user after Google signup

            // Redirect to the profile page
            router.push('/profile'); // Authenticate the user after Google signup
        } catch (error) {
            if (error instanceof Error) {
                setError(`Failed to sign up with Google: ${error.message}`);
                console.log('Google signup failed', error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            user.username.length > 0 &&
            user.email.length > 0 &&
            user.password.length > 0 &&
            user.role.length > 0
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    console.log(user);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="py-10 mb-10 text-5xl">
                {loading ? 'Processing...' : 'Free Sign Up'}
            </h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
                className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Your Username..."
            />

            <input
                className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Your Email..."
            />

            <input
                className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Your Password..."
            />

            <select
                className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
                <option value="candidate">Candidate</option>
                <option value="owner">Owner</option>
            </select>

            <button
                onClick={onSignUp}
                disabled={buttonDisabled || loading}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold">
                {loading ? 'Signing Up...' : 'Register My Account Now'}
            </button>

            <button
                onClick={onGoogleSignUp}
                disabled={loading}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold bg-red-500 text-white">
                {loading ? 'Signing Up with Google...' : 'Sign Up with Google'}
            </button>

            <Link href="/login">
                <p className="mt-10">
                    Do you have a free account already?{' '}
                    <span className="font-bold text-green-600 ml-2 cursor-pointer underline">
                        Login to your account
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

async function authenticateUser(userCredential: UserCredential) {
    const userId = userCredential.user.uid;

    // Store user information and role in Firestore
    await setDoc(doc(db, 'users', userId), {
        email: userCredential.user.email,
        role: 'candidate', // Default role for Google sign-up
    });

    console.log('User authenticated and data stored in Firestore');
}