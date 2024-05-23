import Home from "../../components/home/Home"
import Navbar from "../../components/navbar/Navbar"

function Homepage() {
    return (
        <div className="w-full h-screen bg-orange-200 dark:bg-transparent dark:text-gray-100 dark:border-gray-700">
            <Navbar />
            <Home />
        </div>
    )
}

export default Homepage