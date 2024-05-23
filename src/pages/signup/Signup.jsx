import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../../components/navbar/Navbar"

function Signup() {
    const [inputs, setInputs] = useState({ firstname: '', lastname: '', email: '', password: '', gender: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (inputs.password.length < 6) {
            console.log(inputs.password.length)
            toast.error('Password is short 5 at least')
            return;
        }
        const success = handleError(inputs)
        if (!success) return;

        setLoading(true)
        try {

            const data = await fetch("http://localhost:8090/auth/register", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName: inputs.firstname, lastName: inputs.lastname, email: inputs.email, password: inputs.password, gender: inputs.gender })
            })
            const data2 = await data.json()
            console.log(data2)
            if (!data.ok) {
                throw new Error(data2.message)
            }

            toast.success(data2.message)

            setTimeout(() => {
                navigate("/signin")
            }, 2000)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center bg-orange-200 dark:bg-transparent dark:text-gray-10">
                <div className="hero min-h-screen w-[700px]">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Get Started!</h1>
                            <p className="py-6">Ready to transform your productivity? Create an account and start mastering your tasks today!</p>
                        </div>
                        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <Toaster />
                            <form onSubmit={handleSignUp} className="card-body">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">First Name</span>
                                    </label>
                                    <input value={inputs.firstname} onChange={e => setInputs({ ...inputs, firstname: e.target.value })} type="text" placeholder="First Name" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Last Name</span>
                                    </label>
                                    <input value={inputs.lastname} onChange={e => setInputs({ ...inputs, lastname: e.target.value })} type="text" placeholder="Last Name" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input value={inputs.email} onChange={e => setInputs({ ...inputs, email: e.target.value })} type="email" placeholder="email" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input value={inputs.password} onChange={e => setInputs({ ...inputs, password: e.target.value })} type="password" placeholder="password" className="input input-bordered" required />
                                </div>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Gender</span>
                                    </div>
                                    <select value={inputs.gender} onChange={e => setInputs({ ...inputs, gender: e.target.value })} className="select select-bordered">
                                        <option disabled selected value="">Pick one</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </label>
                                <label className="label">
                                    <Link to="/signin" href="#" className="label-text-alt link link-hover">Already have an account?</Link>
                                </label>
                                <div className="form-control mt-6">
                                    <button className="btn btn-primary bg-orange-200 hover:bg-orange-200 text-slate-600 dark:text-gray-100 bg-transparent border-orange-200 hover:border-transparent dark:hover:bg-slate-800">
                                        {loading ? <span className="loading laoding-ring"></span> : "Get Started"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Signup

function handleError({ firstname, lastname, email, password, gender }) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstname || !lastname || !email || !password || !gender) {
        toast.error("Please fill all the fields.")
        return false
    }
    if (password.length < 5) {
        toast.error("Password must be at least 6 character.")
        return false
    }

    if (!emailPattern.test(email)) {
        toast.error("Invalid email format");
        return false;
    }
    return true
}