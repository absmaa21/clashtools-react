import './App.css'
import AdminDashboard from "./screens/admin/AdminDashboard.tsx";
import {Route, Routes, useLocation, useNavigate} from "react-router";
import Index from "./screens";
import UpgradeTracker from "./screens/UpgradeTracker.tsx";
import Layout from "./components/Layout.tsx";
import {useEffect} from "react";
import useClient from "./hooks/useClient.ts";
import AccountChooser from "./components/AccountChooser.tsx";

function App() {

  const Client = useClient()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    if (location.pathname.includes('admin') && !Client.isAdmin()) navigate('/')
  }, [Client, location.pathname, navigate]);

  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route>
          <Route index element={<Index/>}/>
          <Route path={"/tracker"} element={<AccountChooser/>}/>
          <Route path={"/tracker/:accountId"} element={<UpgradeTracker/>}/>
        </Route>

        <Route path={'/admin'}>
          <Route index element={<AdminDashboard/>}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
