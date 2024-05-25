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

function Projects() {
    const { authUser } = useAuthContext()
    const [inputs, setInputs] = useState({ name: '', description: '', date: '' })
    const [projects, setProjects] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);

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
    const handleProductSearch = async () => {

    }
    const handleProjectDelete = async () => {
        alert("k")
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
                                                    <button onClick={() => handleProjectDelete(project.id)} className="btn btn-warning btn-xs text-white">Update</button>
                                                    <button onClick={() => handleProjectDelete(project.id)} className="btn btn-info btn-xs text-white">Read</button>
                                                    <button onClick={() => handleProjectDelete(project.id)} className="btn btn-error btn-xs text-white">Delete</button>
                                                </th>
                                            </tr>
                                        ))}
                                    </tbody>
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