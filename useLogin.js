import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "./src/AuthContext";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const getUser = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8090/users/${id}`, {
                withCredentials: true
            });
            const result = res.data.user;
            console.log(result);
    
            localStorage.setItem("user", JSON.stringify(result));
            setAuthUser(result);
    
            alert("Welcome back");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const login = async ({ email, password }) => {
        try {
            const response = await axios.post("http://localhost:8090/auth/login", {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (response.status !== 200) {
                throw new Error("Error in login process");
            }

            console.log(response);

            await getUser(response.data.userId);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;
