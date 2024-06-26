import { AiFillProject, AiOutlineDashboard } from "react-icons/ai"
import Navbar from "../../components/navbar/Navbar"
import LeftNav from "./LeftNav"
import { FaTasks } from "react-icons/fa"
import { HiMiniUsers } from "react-icons/hi2"
import { CiSquarePlus } from "react-icons/ci"
import { useEffect, useState } from "react"
import axios from "axios"
import { displayDate, getCurrentDate } from "./Main"
import { useAuthContext } from "../../AuthContext"

function Users() {
    const { authUser } = useAuthContext()
    const [inputs, setInputs] = useState({ name: '', description: '', date: '' })
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("");
    const handleSubmit = async () => {
        if (!inputs.name || !inputs.description || !inputs.date) {
            alert("Please Fill all fields")
            return;
        }
        setLoading(true)
        try {
            const res = await axios.post("http://localhost:8090/projects", {
                name: inputs.name,
                description: inputs.description,
                expectedEndDate: inputs.date
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            if (res.status !== 200) {
                console.log(res)
                throw new Error("Ooppsss..")
            }

            setInputs({ name: '', description: '', date: '' })

            alert(res.data.name + "Created successfully")

            setProjects([...projects, res.data])

        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }
    // Fetch user
    useEffect(() => {

        const fetchUser = async () => {
            setLoading(true)
            try {
                const res = await axios.get("http://localhost:8090/users/", { withCredentials: true })

                if (res.status !== 200) {
                    console.log(res)
                    throw new Error("Something went wrong. Try again later")
                }
                setUsers(res.data.users)
            } catch (error) {
                alert(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])
    // Delete a user
    const handleUserDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8090/users/${id}`, { withCredentials: true })

            if (res.status !== 200) {
                throw new Error("Something went wrong")

            }
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            alert(error.message)
        }
    }
    // Search a user
    // Search a user
    const handleUserSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            // If search query is empty, reset the users to the original list
            setUsers(users);
            return;
        }

        if (search.length < 3) {
            alert("Search term must be at least 3 characters long");
            return;
        }

        const filteredUsers = users.filter(user =>
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );

        if (filteredUsers.length > 0) {
            // If users are found, update the state with filtered users
            setUsers(filteredUsers);
        } else {
            // If no users are found, display an alert
            alert("No users found");
        }
    };

    return (
        <>
            <Navbar />
            <div className="h-screen flex justify-between items-start">
                <div className="border w-52 h-full">
                    <ul>
                        <LeftNav name="Home" icon={<AiOutlineDashboard />} link="dashboard" />
                        <LeftNav name="Project" icon={<AiFillProject />} link="projects" />
                        <LeftNav name="My Tasks" icon={<FaTasks />} link="tasks" />
                        <LeftNav name="Users" icon={<HiMiniUsers />} link="users" />
                        <li onClick={() => document.getElementById('my_modal_5').showModal()} className="flex items-center gap-2 p-2 border-b border-gray-400 cursor-pointer">
                            <CiSquarePlus />
                            <span>New project</span>
                        </li>

                        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">New Project</h3>
                                <div className="py-4">
                                    <p>Description</p>
                                </div>
                                <div className="modal-action justify-start">
                                    <form method="dialog" className="w-full">
                                        {/* if there is a button in form, it will close the modal */}
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Project name</span>
                                            </div>
                                            <input value={inputs.name} onChange={e => setInputs({ ...inputs, name: e.target.value })} type="text" placeholder="Project name" className="input input-bordered w-full max-w-xs" />
                                        </label>
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Description</span>
                                            </div>
                                            <input value={inputs.description} onChange={e => setInputs({ ...inputs, description: e.target.value })} type="text" placeholder="Description" className="input input-bordered w-full max-w-xs" />
                                        </label>
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Expected end date</span>
                                            </div>
                                            <input value={inputs.date} onChange={e => setInputs({ ...inputs, date: e.target.value })} type="date" placeholder="Expected end date" className="input input-bordered w-full max-w-xs" min={getCurrentDate()} />
                                        </label>
                                        <div className="mt-5 flex gap-3 justify-end">
                                            <button className="btn order-2">Cancel</button>
                                            <p className="btn btn-active btn-primary" onClick={handleSubmit}>
                                                {loading ? <span className="loading loading-dots"></span> : "Submit"}
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </ul>
                </div>
                <div className="border flex-grow p-5">
                    <div className="w-full py-2">
                        <h1 className="text-2xl font-bold">Hey {authUser.firstName}</h1>
                        <p>{"It's"} {displayDate()}</p>
                    </div>
                    <div className="pt-5 flex justify-end">
                        <form className="flex gap-2" onSubmit={handleUserSearch}>
                            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search user" className="input input-bordered w-full max-w-xs" />
                            <button className="btn">Search</button>
                        </form>

                    </div>
                    <div className="py-5">
                        <div className="border flex gap-3 flex-col flex-grow rounded-md">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>Names</th>
                                            <th>Email</th>
                                            <th>Gender</th>
                                            <th>Role</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0
                                            ?
                                            users.filter(user => user.id !== authUser.id).map(user =>
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <div className="font-bold">{`${user.firstName} ${user.lastName}`}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>{user.gender}</td>
                                                    <td>{user.role.name}</td>
                                                    <th>
                                                        <button onClick={() => handleUserDelete(user.id)} className="btn btn-error btn-xs text-white">Delete</button>
                                                    </th>
                                                </tr>

                                            )

                                            :
                                            <h1>No users yet</h1>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users