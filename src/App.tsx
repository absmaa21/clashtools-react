import './App.css'
import AdminDashboard from "./screens/admin/AdminDashboard.tsx";
import {Route, Routes} from "react-router";
import Index from "./screens";
import UpgradeTracker from "./screens/UpgradeTracker.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";
import RegisterScreen from "./screens/RegisterScreen.tsx";

function App() {

  return (
    <Routes>
      <Route>
        <Route index element={<Index/>} />
        <Route path={"/login"} element={<LoginScreen/>} />
        <Route path={"/register"} element={<RegisterScreen/>} />
        <Route path={"/tracker"} element={<UpgradeTracker/>} />
      </Route>

      <Route path={'/admin'}>
        <Route index element={<AdminDashboard/>} />
      </Route>
    </Routes>
  )
}

export default App
