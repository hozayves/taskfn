import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './pages/home/Homepage'
import Signin from './pages/login/Signin'
import Signup from './pages/signup/Signup'
import Profile from './pages/profile/Profile'
import Main from './pages/main/Main'
import { useAuthContext } from './AuthContext'
import Projects from './pages/main/Projects'
import Tasks from './pages/main/Tasks'
import Users from './pages/main/Users'

function App() {
  const { authUser } = useAuthContext()

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/signin' element={authUser ? <Navigate to="/dashboard" /> : <Signin />} />
        <Route path='/signup' element={authUser ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path='/profile' element={authUser ? <Navigate to="/signin" /> : <Profile />} />
        <Route path='/dashboard' element={!authUser ? <Navigate to="/signin" /> : <Main />} />
        <Route path='/projects' element={!authUser ? <Navigate to="/signin" /> : <Projects />} />
        <Route path='/tasks' element={!authUser ? <Navigate to="/signin" /> : <Tasks />} />
        <Route path='/users' element={!authUser ? <Navigate to="/signin" /> : <Users />} />
      </Routes>
    </>
  )
}

export default App
