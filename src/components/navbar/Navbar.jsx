/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../AuthContext";

function Navbar() {
    const { authUser } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const logout = async () => {
        setLoading(true);
        try {
            // Check if the token exists
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (token) {
                // Remove the "token" cookie
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }

            // Remove the "logged-user" from local storage
            localStorage.removeItem("user");

            alert("Logging out...");
            // Redirect to the homepage after a short delay
            setTimeout(() => {
                navigate("/signin");
                window.location.reload();
            }, 2000);
        } catch (error) {
            alert("Error in logout process");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="navbar bg-orange-200 text-slate-800 border-b border-orange-300 dark:bg-transparent dark:text-gray-100 dark:border-gray-700 z-10">
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl hover:bg-transparent">Fadoul Tasks</Link>
                </div>
                <div className="navbar-end ">
                    {authUser ? (
                        <>
                            <Link to="/tasks" className="btn btn-ghost">Dashboard</Link>
                            <btn onClick={() => logout()} className="btn btn-ghost">Logout</btn>
                        </>
                    ) : ''}

                    {!authUser ?
                        (
                            <>
                                {/* <Link to="/signin" className="btn btn-ghost hover:bg-transparent hover:underline">Log In </Link> */}
                                <Link to="/signup" className="btn ml-2 dark:text-gray-100">Get Started</Link>
                            </>
                        )
                        : ""}
                </div>
            </div></>
    )
}

export default Navbar