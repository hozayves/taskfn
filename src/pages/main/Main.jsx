import Navbar from "../../components/navbar/Navbar"
import { AiOutlineDashboard } from "react-icons/ai";
import { AiFillProject } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { HiMiniUsers } from "react-icons/hi2";
import LeftNav from "./LeftNav";
import Stast from "./Stast";
import ProjectList from "./ProjectList";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";

function Main() {
    const { authUser } = useAuthContext()
    const [inputs, setInputs] = useState({ name: '', description: '', date: '' })
    const [projects, setProjects] = useState([])
    const [tasts, setTasks] = useState([])
    const [loading, setLoading] = useState(false)

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
    // Fetch my project
    useEffect(() => {
        const fetchProject = async () => {
            const res = await axios.get("http://localhost:8090/projects", { withCredentials: true })
            if (res.status !== 200) {
                alert("Problem occurs to get project")
                return;
            }
            setProjects(res.data)

        }
        fetchProject()
    }, [])
    // Fetch my Tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const res = await axios.get("http://localhost:8090/tasks", { withCredentials: true })
            if (res.status !== 200) {
                alert("Ooops")
                return;
            }
            setTasks(res.data.tasks)
        }
        fetchTasks()
    }, [])
    return (
        <>
            <Navbar />
            <div className="h-screen flex justify-between items-start">
                <div className="border w-52 h-full">
                    <ul>
                        <LeftNav name="Home" icon={<AiOutlineDashboard />} link="dashboard" />
                        <LeftNav name="Project" icon={<AiFillProject />} link="projects" />
                        <LeftNav name="My Tasks" icon={<FaTasks />} link="tasks" />
                        {authUser?.role?.name === 'MANAGER'
                            ? (
                                <>
                                    <LeftNav name="Users" icon={<HiMiniUsers />} link="users" />
                                    <li onClick={() => document.getElementById('my_modal_5').showModal()} className="flex items-center gap-2 p-2 border-b border-gray-400 cursor-pointer">
                                        <CiSquarePlus />
                                        <span>New project</span>
                                    </li>
                                </>
                            ) : ""}

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
                    <div className="py-5 px-3 flex flex-wrap gap-3 border rounded-md ">
                        <Stast title="total project" number={projects.length} />
                        <Stast title="total tasks" number={tasts.length} />
                        <Stast title="total users" number="9" />
                        <Stast title="assigned tasks" number="3" />
                        <Stast title="completed tasks" number="1" />
                    </div>
                    <div className="py-5 flex justify-between gap-3">
                        <div className="border flex gap-3 flex-col flex-grow rounded-md">
                            <p className="capitalize text-xl border-b-2 border-gray-50 p-3">
                                <span>my project</span>
                            </p>
                            <div className="p-3">
                                <ul className="flex flex-col gap-2">
                                    {projects.length > 0
                                        ?
                                        projects.slice(0, 5).sort((a, b) => b.id - a.id).map(project =>
                                            <ProjectList key={project.id} name={project.name} desc={project.description} due={project.expectedEndDate} />
                                        )

                                        : (
                                            <h1>Not Yet Project</h1>
                                        )}
                                    <li className="p-2 rounded-md border-dotted border-2 flex justify-center items-center">
                                        <Link to="/projects" className="p-2 text-md font-medium">Show All</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border flex-grow rounded-md gap-3 flex flex-col">
                            <p className="capitalize text-xl border-b-2 border-gray-50 p-3">
                                <span>my tasks</span>
                            </p>
                            <div className="p-3">
                                <ul className="flex flex-col gap-2">
                                    {tasts.length > 0
                                        ?
                                        tasts.slice(0, 5).map(task =>
                                            <li key={task.id} className="border flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                                                <div className="flex flex-col gap-2 leading-none capitalize">
                                                    <span className="font-semibold">{truncateSentence(task.name, 26, '')}</span>
                                                    <p className="font-light">{truncateSentence(task.description, 20, '...')}</p>
                                                </div>
                                                <div className="flex justify-center items-center gap-2 rounded-full font-light bg-red-700 text-white px-3">
                                                    <span>{task.priority}</span>
                                                </div>
                                                <div className="flex justify-center items-center gap-2 p-1 rounded-md font-light bg-green-700 text-white px-3">
                                                    <span>{task.status}</span>
                                                </div>
                                            </li>
                                        )
                                        :
                                        <h1>No Tasks yet</h1>
                                    }

                                    <li className="p-2 rounded-md border-dotted border-2 flex justify-center items-center">
                                        <Link to="/tasks" className="p-2 text-md font-medium">Show All</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Main

// eslint-disable-next-line react-refresh/only-export-components
export function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month or day is less than 10
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}

// eslint-disable-next-line react-refresh/only-export-components
export function displayDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const currentDate = new Date();
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `It's ${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
}

// eslint-disable-next-line react-refresh/only-export-components
export function truncateSentence(sentence, maxLength, dots) {
    if (sentence.length <= maxLength) {
        return sentence; // Return the original sentence if it's already within the maxLength
    } else {
        // Truncate the sentence to the maxLength and append "..."
        return sentence.substring(0, maxLength) + dots;
    }
}

