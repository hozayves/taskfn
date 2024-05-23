import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './pages/home/Homepage'
import Signin from './pages/login/Signin'
import Signup from './pages/signup/Signup'
import Profile from './pages/profile/Profile'
import Main from './pages/main/Main'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/tasks' element={<Main />} />
      </Routes>
    </>
  )
}

export default App
