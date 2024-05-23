import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useLogin = () => {
    const [loading, setLoading] = useState(false);

    const login = async ({ email, password }) => {
        try {
            const response = await axios.post("http://localhost:8090/auth/login", {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log(response);

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
