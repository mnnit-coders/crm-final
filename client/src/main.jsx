import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'

import Testing from './Testing.jsx'
// Page IMPORTS
import Login from './Pages/Login.jsx'
import Owner from './Pages/Owner.jsx'
import Home from './Pages/Home.jsx'
import OwnerRegister from './Pages/OwnerRegister.jsx'
import Register from './Pages/Register.jsx'
import ChangePasswordOwner from './Pages/ChangePasswordOwner.jsx'
import ChangePasswordAdmin from './Pages/ChangePasswordAdmin.jsx'
import Campaign from './Pages/Campaign'
import Dashboard from './Pages/Dashboard'
import Contacts from './Pages/Contacts'
import Reports_Campaign from './Pages/Reports_Campaign'
import Reports_Campaign_Lead from './Pages/Reports_Campaign_lead'
import Reports_User_Call from './Pages/Reports_User_Call'
import Reports_User_Login from './Pages/Reports_User_Login'

import Dialer from "./Pages/Dialer"
import ManageUser from './Pages/ManageUser'
import DialerReport from './Pages/DialerReport'
import DialerTask from './Pages/DialerTask'
import DialerLead from './Pages/DialerLead'
import DialerCampaign from './Pages/DialerCampaign'
import Settings from './Pages/Settings'
import CampaignStats from './Pages/CampaignStats'
import CustomLeadForm from './Pages/CustomLeadForm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <div>
    <ToastContainer autoClose={3000} pauseOnHover={false} theme="dark" />
    <BrowserRouter>
      <Routes>
        <Route path="testing" element={<Testing/>} />
        <Route path="login" element={<Login />} />
        <Route path="owner" element={<Owner />} />
        {/* <Route path="admin" element={<Admin/>}/>  */}
        <Route path="ownerregister" element={<OwnerRegister/>}/> 
        <Route path="register" element={<Register />} />
        
        <Route path="changePassword" element={<ChangePasswordAdmin />}>
          <Route path="org" element={<ChangePasswordOwner />} />
        </Route>

        <Route path="admin"  >
          <Route path='dashboard' element={<Dashboard />} />
          
          <Route path="campaigns" >
            <Route path=":id" element={<CampaignStats />} />
            <Route path="edit/:id" element={<Settings/> } />
            <Route path="" element={<Campaign />} />
          </Route>

          <Route path="contacts" element={< Contacts />}/>
          <Route path="manage" element={<ManageUser />} />
          <Route path="settings" element={<Settings />} />
          <Route path="campaignstats" element={<CampaignStats />} />
          <Route path="/admin/campaign/:id" component={CampaignStats} />

          <Route path="reports_campaign" element={<Reports_Campaign />}/>
          <Route path="reports_campaign_lead" element={<Reports_Campaign_Lead />}/>
          <Route path="reports_user_call" element={<Reports_User_Call />}/>
          <Route path="reports_user_login" element={<Reports_User_Login />}/>
          

          <Route path="customleadform" element={<CustomLeadForm />} />
        </Route>

        <Route path="dialer" >
          <Route path="reports" element={<DialerReport />} />
          <Route path="tasks" element={<DialerTask />} />
          <Route path="leads" element={<DialerLead />} />
          <Route path="campaigns" element={<DialerCampaign />} />
          <Route path="" element={<Dialer />}/>
        </Route>

        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </div>,
)
