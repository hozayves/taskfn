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
import TasksList from "./tasks/TasksList"

function Tasks() {
    const { authUser } = useAuthContext()
    const [inputs, setInputs] = useState({ name: '', description: '', date: '' })
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState("")

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
    // Get tasks assigned to user
    useEffect(() => {
        const fetchTaskForUser = async () => {
            setLoading(true)
            try {
                const res = await axios(`http://localhost:8090/tasks/user/${authUser.id}`, { withCredentials: true })
                if (res.status !== 200) {
                    throw new Error("Something went wrong")
                }
                setTasks(res.data.Tasks)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchTaskForUser()
    }, [authUser.id])

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter(task => {
        if (filter === "") return true;
        if (filter === "COMPLETED") return task.status === filter || task.status === "COMPLETED";
        return task.status === filter;
    });
    const updateFilter = (newFilter) => {
        setFilter(newFilter);
    }
    const handleTaskCompleteCallback = (newStatus) => {
        // Update filter if task is completed
        if (newStatus === 'COMPLETED') {
            setFilter('COMPLETED');
        }
    }
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
                <div className="border w-full p-5">
                    <div className="w-full py-2">
                        <h1 className="text-2xl font-bold">Hey {authUser?.firstName}</h1>
                        <p>{"It's"} {displayDate()}</p>
                    </div>
                    <div className="py-5 mt-10 flex flex-col gap-2">
                        <h2 className="py-5 text-xl">My Backlog</h2>
                        <ul className="p-2 flex justify-end gap-1 capitalize">
                            <li onClick={() => setFilter("")} className={`btn ${filter === "" ? 'btn-primary' : 'btn-ghost'}`}>All Tasks</li>
                            <li onClick={() => setFilter("COMPLETED")} className={`btn ${filter === "COMPLETED" ? 'btn-primary' : 'btn-ghost'}`}>completed</li>
                            <li onClick={() => setFilter("IN_PROGRESS")} className={`btn ${filter === "IN_PROGRESS" ? 'btn-primary' : 'btn-ghost'}`}>In progress</li>
                            <li onClick={() => setFilter("TODO")} className={`btn ${filter === "TODO" ? 'btn-primary' : 'btn-ghost'}`}>todo</li>
                        </ul>
                        {filteredTasks.length > 0
                            ? filteredTasks.map(task =>
                                <TasksList
                                    key={task.id}
                                    progress={task.progress}
                                    id={task.id} name={task.name}
                                    due={task.dueDate}
                                    description={task.description}
                                    status={task.status}
                                    handleTaskCompleteCallback={handleTaskCompleteCallback}
                                    updateFilter={updateFilter}
                                />
                            )
                            : "No tasks found"
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tasks