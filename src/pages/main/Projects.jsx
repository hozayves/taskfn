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
import { BsThreeDotsVertical } from "react-icons/bs"

function Projects() {
    const { authUser } = useAuthContext()
    const [inputs, setInputs] = useState({ name: '', description: '', date: '', assignedUser: '' })
    const [projects, setProjects] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [developerUsers, setDeveloperUsers] = useState([]);

    // Fetch users with role of DEVELOPER
    useEffect(() => {
        const fetchDeveloperUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8090/users/", { withCredentials: true });

                if (res.status !== 200) {
                    console.log(res);
                    throw new Error("Something went wrong. Try again later");
                }
                setDeveloperUsers(res.data.users);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDeveloperUsers();
    }, []);

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

            console.log(res.data)
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
                const res = await axios.get("http://localhost:8090/projects", { withCredentials: true })

                if (res.status !== 200) {
                    console.log(res)
                    throw new Error("Something went wrong. Try again later")
                }
                setProjects(res.data)

            } catch (error) {
                alert(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const handleTaskCreated = async (e, id) => {
        e.preventDefault()
        if (!inputs.name || !inputs.description || !inputs.date || !inputs.assignedUser) {
            alert("Please Fill all fields");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8090/tasks", {
                name: inputs.name,
                description: inputs.description,
                dueDate: inputs.date,
                assignedUserId: inputs.assignedUser,
                projectId: id
            }, {
                withCredentials: true
            });

            if (res.status !== 200) {
                console.log(res);
                throw new Error("Ooppsss..");
            }
            console.log(res)
            setInputs({ name: '', description: '', date: '', assignedUser: '' });
            alert(res.data.name + " created successfully");
            // setProjects([...projects, res.data]);
        } catch (error) {
            //     console.log(error)
            //     // alert(error);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteProject = async (projectId) => {
        setLoading(true);
        try {
            const res = await axios.delete(`http://localhost:8090/projects/${projectId}`, {
                withCredentials: true
            });
            if (res.status !== 200) {
                throw new Error("Failed to delete project");
            }
            // Filter out the deleted project from the projects state
            setProjects(projects.filter(project => project.id !== projectId));
            alert("Project deleted successfully");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleProductSearch = async () => {

    }

    // Pagination Logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                        <h1 className="text-2xl font-bold">Hey {authUser?.firstName}</h1>
                        <p>{"It's"} {displayDate()}</p>
                    </div>
                    <div className="pt-5 flex justify-end">
                        <form className="flex gap-2" onSubmit={handleProductSearch}>
                            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search user" className="input input-bordered w-full max-w-xs" />
                            <button className="btn">Search</button>
                        </form>

                    </div>
                    <div className="py-5">
                        <div className="border flex gap-3 flex-col flex-grow rounded-md">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* Table Header */}
                                    <thead>
                                        <tr>
                                            <th>Project Name</th>
                                            <th>Description</th>
                                            <th>Due Date</th>
                                            <th>Creator</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {developerUsers.length > 0 ? (
                                        <tbody>
                                            {/* Projects Data */}
                                            {currentProjects.map((project) => (
                                                <tr key={project.id}>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <div className="font-bold">{project.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{project?.description}</td>
                                                    <td>{project?.expectedEndDate}</td>
                                                    <td>{project.createdBy?.firstName}</td>
                                                    <th className="flex gap-2 justify-end">
                                                        <div className="dropdown dropdown-bottom dropdown-end">
                                                            <div tabIndex={0} role="button" className="btn m-1"><BsThreeDotsVertical /></div>
                                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                                <li><a onClick={() => document.getElementById('add_task').showModal()}>Add Task</a></li>
                                                                <li><a onClick={() => handleDeleteProject(project.id)}>Remove</a></li>
                                                                <li><a>View</a></li>

                                                                {/* Add Task Modal */}
                                                                <dialog id="add_task" className="modal modal-bottom sm:modal-middle">
                                                                    <div className="modal-box">
                                                                        <h3 className="font-bold text-lg">New Task</h3>
                                                                        <div className="py-4">
                                                                            <p>Description</p>
                                                                        </div>
                                                                        <div className="modal-action justify-start">
                                                                            <form method="dialog" className="w-full">
                                                                                <label className="form-control w-full max-w-xs">
                                                                                    <div className="label">
                                                                                        <span className="label-text">Task name</span>
                                                                                    </div>
                                                                                    <input value={inputs.name} onChange={e => setInputs({ ...inputs, name: e.target.value })} type="text" placeholder="Task name" className="input input-bordered w-full max-w-xs" />
                                                                                </label>
                                                                                <label className="form-control w-full max-w-xs">
                                                                                    <div className="label">
                                                                                        <span className="label-text">Description</span>
                                                                                    </div>
                                                                                    <input value={inputs.description} onChange={e => setInputs({ ...inputs, description: e.target.value })} type="text" placeholder="Description" className="input input-bordered w-full max-w-xs" />
                                                                                </label>
                                                                                <label className="form-control w-full max-w-xs">
                                                                                    <div className="label">
                                                                                        <span className="label-text">Assign User</span>
                                                                                    </div>
                                                                                    <select
                                                                                        value={inputs.assignedUser}
                                                                                        onChange={(e) => setInputs({ ...inputs, assignedUser: e.target.value })}
                                                                                        className="select select-bordered w-full max-w-xs"
                                                                                    >
                                                                                        <option value="">Select User</option>
                                                                                        {developerUsers.map((user) => (
                                                                                            <option key={user.id} value={user.id}>
                                                                                                {user.firstName} {user.lastName} ({user?.role.name})
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </label>
                                                                                <label className="form-control w-full max-w-xs">
                                                                                    <div className="label">
                                                                                        <span className="label-text">Expected end date</span>
                                                                                    </div>
                                                                                    <input value={inputs.date} onChange={e => setInputs({ ...inputs, date: e.target.value })} type="date" placeholder="Expected end date" className="input input-bordered w-full max-w-xs" min={getCurrentDate()} />
                                                                                </label>
                                                                                {/* Add a dropdown for selecting users */}
                                                                                <div className="mt-5 flex gap-3 justify-end">
                                                                                    <button className="btn order-2">Cancel</button>
                                                                                    <p className="btn btn-active btn-primary" onClick={(e) => handleTaskCreated(e, project.id)}>
                                                                                        {loading ? <span className="loading loading-dots"></span> : "Submit"}
                                                                                    </p>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </dialog>
                                                            </ul>
                                                        </div>
                                                    </th>
                                                </tr>
                                            ))}
                                        </tbody>

                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan="5">Loading...</td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Pagination */}
                    <nav className="flex justify-center">
                        <ul className="pagination flex justify-center gap-4">
                            {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }).map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                    <button onClick={() => paginate(index + 1)} className="btn btn-circle">
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Projects