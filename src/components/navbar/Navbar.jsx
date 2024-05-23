import { Link } from "react-router-dom"

function Navbar() {
    return (
        <>
            <div className="navbar bg-orange-200 text-slate-800 border-b border-orange-300 dark:bg-transparent dark:text-gray-100 dark:border-gray-700 z-10">
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl hover:bg-transparent">Fadoul Tasks</Link>
                </div>
                <div className="navbar-end ">
                    <Link to="/tasks" className="btn btn-ghost">My Tasks</Link>
                    <Link to="/signin" className="btn btn-ghost hover:bg-transparent hover:underline">Log In </Link>
                    <Link to="/signup" className="btn ml-2 dark:text-gray-100">Get Started</Link>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 dark:bg-slate-800">
                        <li><Link to="/profile">Profile</Link></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div></>
    )
}

export default Navbar