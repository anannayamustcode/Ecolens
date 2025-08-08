// app/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, updateUserProfile } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields");
    }
  
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
  
    try {
      setError("");
      setLoading(true);
      await signUp(email, password);
      await updateUserProfile({ displayName: name });
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to create an account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Sign Up</h2>
        {/* Rest of your signup form */}
      </div>
    </div>
  );
}

// // pages/signup.js
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../AuthContext";

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { signUp, updateUserProfile } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!name || !email || !password || !confirmPassword) {
//       return setError("Please fill in all fields");
//     }
  
//     if (password !== confirmPassword) {
//       return setError("Passwords do not match");
//     }
  
//     try {
//       setError("");
//       setLoading(true);
  
//       await signUp(email, password);
//       await updateUserProfile({ displayName: name });
  
//       router.push("/dashboard");
//     } catch (err) {
//       setError("Failed to create an account");
//       console.error(err);
//     }
  
//     setLoading(false);
//   };
  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Sign Up</h2>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 mb-2">Full Name</label>
//             <input 
//               type="text" 
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your full name" 
//               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Email</label>
//             <input 
//               type="email" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email" 
//               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Password</label>
//             <input 
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)} 
//               placeholder="Create a password" 
//               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Confirm Password</label>
//             <input 
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)} 
//               placeholder="Confirm your password" 
//               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
//               required
//             />
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="!bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 w-full rounded-lg transition duration-300"
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>

//         <div className="text-center mt-6">
//           <p className="text-gray-600">
//             Already have an account?{" "}
//             <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { useAuth } from "../contexts/AuthContext";
// // import { auth } from "../firebase"; // Make sure this path is correct
// // import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// // const SignUp = () => {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const { signUp } = useAuth();
// //   const navigate = useNavigate();

// //   // const handleSubmit = async (e) => {
// //   //   e.preventDefault();

// //   //   if (!name || !email || !password || !confirmPassword) {
// //   //     return setError("Please fill in all fields");
// //   //   }

// //   //   if (password !== confirmPassword) {
// //   //     return setError("Passwords do not match");
// //   //   }

// //   //   try {
// //   //     setError("");
// //   //     setLoading(true);

// //   //     // await signup(name, email, password);
// //   //     await signup( email, password);
// //   //     navigate("/dashboard"); // Redirects all users to job preferences
// //   //   } catch (err) {
// //   //     setError("Failed to create an account");
// //   //     console.error(err);
// //   //   }

// //   //   setLoading(false);
// //   // };


// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
  
// //     if (!name || !email || !password || !confirmPassword) {
// //       return setError("Please fill in all fields");
// //     }
  
// //     if (password !== confirmPassword) {
// //       return setError("Passwords do not match");
// //     }
  
// //     try {
// //       setError("");
// //       setLoading(true);
  
// //       await signUp(email, password);
  
// //       // 🔥 Set display name in Firebase user profile
// //       await updateProfile(auth.currentUser, {
// //         displayName: name
// //       });
  
// //       navigate("/dashboard");
// //     } catch (err) {
// //       setError("Failed to create an account");
// //       console.error(err);
// //     }
  
// //     setLoading(false);
// //   };
  
// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
// //       <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
// //         <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Sign Up</h2>

// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
// //             {error}
// //           </div>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           {/* Full Name */}
// //           <div>
// //             <label className="block text-gray-700 mb-2">Full Name</label>
// //             <input 
// //               type="text" 
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               placeholder="Enter your full name" 
// //               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
// //               required
// //             />
// //           </div>

// //           {/* Email */}
// //           <div>
// //             <label className="block text-gray-700 mb-2">Email</label>
// //             <input 
// //               type="email" 
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="Enter your email" 
// //               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
// //               required
// //             />
// //           </div>

// //           {/* Password */}
// //           <div>
// //             <label className="block text-gray-700 mb-2">Password</label>
// //             <input 
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)} 
// //               placeholder="Create a password" 
// //               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
// //               required
// //             />
// //           </div>

// //           {/* Confirm Password */}
// //           <div>
// //             <label className="block text-gray-700 mb-2">Confirm Password</label>
// //             <input 
// //               type="password"
// //               value={confirmPassword}
// //               onChange={(e) => setConfirmPassword(e.target.value)} 
// //               placeholder="Confirm your password" 
// //               className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" 
// //               required
// //             />
// //           </div>

// //           {/* Submit Button */}
// //           <button 
// //             type="submit" 
// //             disabled={loading}
// //             className="!bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 w-full rounded-lg transition duration-300"
// //           >
// //             {loading ? "Creating Account..." : "Create Account"}
// //           </button>
// //         </form>

// //         {/* Login Link */}
// //         <div className="text-center mt-6">
// //           <p className="text-gray-600">
// //             Already have an account?{" "}
// //             <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">
// //               Login
// //             </Link>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SignUp;
