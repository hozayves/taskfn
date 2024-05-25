import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"
import Navbar from "../../components/navbar/Navbar"
import useLogin from "../../../useLogin"

function Signin() {
    const [inputs, setInputs] = useState({ email: '', password: '' })
    const { loading, login } = useLogin()


    const handleSignIn = async (e) => {
        e.preventDefault()
        if (inputs.email == '' || inputs.password == '') {
            toast.error("Email or Password is empty!")
        }

        await login(inputs)

    }
    return (
        <>
            <Navbar />
            <div className=" flex justify-center items-center bg-orange-200 dark:bg-transparent dark:text-gray-10">
                <div className="hero min-h-screen w-[700px]">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Login now!</h1>
                            <p className="py-6">Unlock your potential and conquer your day – sign in and turn your to-dos into ta-das!</p>
                        </div>
                        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <Toaster />
                            <form onSubmit={handleSignIn} className="card-body">
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
                                <label className="label">
                                    <Link to="/signup" href="#" className="label-text-alt link link-hover">{"Don't "}have an account?</Link>
                                </label>
                                <div className="form-control mt-6">
                                    <button className="btn btn-primary bg-orange-200 hover:bg-orange-200 text-slate-600 dark:text-gray-100 bg-transparent border-orange-200 hover:border-transparent dark:hover:bg-slate-800">
                                        {loading ? <span className="loading loading-ring"></span> : 'Login'}
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

export default Signin