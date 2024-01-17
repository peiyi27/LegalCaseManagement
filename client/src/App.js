import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import HomeForStaff from "./pages/HomeForStaff";
import ProfileSettingStaff from "./pages/ProfileSettingStaff";
import CaseManagementStaff from "./pages/CaseManagementStaff";
import CreateCaseFormStaff from "./pages/CreateCaseFormStaff";
import UpdateEmailStaff from "./pages/UpdateEmailStaff";
import UpdateNameStaff from "./pages/UpdateNameStaff";
import ViewCaseStaff from "./pages/ViewCaseStaff";
import EditCaseStaff from "./pages/EditCaseStaff";
import DocumentManagementStaff from "./pages/DocumentManagementStaff";
import UserManagementAdmin from "./pages/UserManagementAdmin";
import UploadDocumentStaff from "./pages/UploadDocumentStaff";
import ProfileSettingAdmin from "./pages/ProfileSettingAdmin";
import CaseManagementAdmin from "./pages/CaseManagementAdmin";
import CreateCaseFormAdmin from "./pages/CreateCaseFormAdmin";
import UpdateEmailAdmin from "./pages/UpdateEmailAdmin";
import UpdateNameAdmin from "./pages/UpdateNameAdmin";
import ViewCaseAdmin from "./pages/ViewCaseAdmin";
import EditCaseAdmin from "./pages/EditCaseAdmin";
import DocumentManagementCaseAdmin from "./pages/DocumentManagementCaseAdmin";
import UploadDocumentCaseAdmin from "./pages/UploadDocumentCaseAdmin";
import MyCaseAdmin from "./pages/MyCaseAdmin";
import CreateMyCaseFormAdmin from "./pages/CreateMyCaseFormAdmin";
import ViewMyCaseAdmin from "./pages/ViewMyCaseAdmin";
import EditMyCaseAdmin from "./pages/EditMyCaseAdmin";
import DocumentManagementMyCaseAdmin from "./pages/DocumentManagementMyCaseAdmin";
import UploadDocumentMyCaseAdmin from "./pages/UploadDocumentMyCaseAdmin";
import HomeForClient from "./pages/HomeForClient";
import CaseManagementClient from "./pages/CaseManagementClient";
import ViewCaseClient from "./pages/ViewCaseClient";
import DocumentManagementClient from "./pages/DocumentManagementClient";
import ProfileSettingClient from "./pages/ProfileSettingClient";
import UpdateNameClient from "./pages/UpdateNameClient";
import UpdateEmailClient from "./pages/UpdateEmailClient";
import ViewEventClient from "./pages/ViewEventClient";
import React from 'react';
import EventManagementClient from './pages/EventManagementClient';
import './App.css';



function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
        <Route path="/Signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgetPassword" element={<ForgetPassword/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/HomeForStaff" element={<HomeForStaff/>} />
          <Route path="/ProfileSettingStaff" element={<ProfileSettingStaff/>} />
          <Route path="/CaseManagementStaff" element={<CaseManagementStaff/>} />
          <Route path="/CreateCaseFormStaff" element={<CreateCaseFormStaff/>} />
          <Route path="/UpdateEmailStaff" element={<UpdateEmailStaff/>} />
          <Route path="/UpdateNameStaff" element={<UpdateNameStaff/>} />
          <Route path="/ViewCaseStaff/:caseId" element={<ViewCaseStaff />} />
          <Route path="/EditCaseStaff/:caseId" element={<EditCaseStaff />} />
          <Route path="/DocumentManagementStaff/:caseId" element={<DocumentManagementStaff/>} />
          <Route path="/UploadDocumentStaff/:caseId" element={<UploadDocumentStaff/>} />
          <Route path="/UserManagementAdmin" element={<UserManagementAdmin/>} />
          <Route path="/ProfileSettingAdmin" element={<ProfileSettingAdmin/>} />
          <Route path="/CaseManagementAdmin" element={<CaseManagementAdmin/>} />
          <Route path="/CreateCaseFormAdmin" element={<CreateCaseFormAdmin/>} />
          <Route path="/UpdateEmailAdmin" element={<UpdateEmailAdmin/>} />
          <Route path="/UpdateNameAdmin" element={<UpdateNameAdmin/>} />
          <Route path="/ViewCaseAdmin/:caseId" element={<ViewCaseAdmin />} />
          <Route path="/EditCaseAdmin/:caseId" element={<EditCaseAdmin />} />
          <Route path="/DocumentManagementCaseAdmin/:caseId" element={<DocumentManagementCaseAdmin/>} />
          <Route path="/UploadDocumentCaseAdmin/:caseId" element={<UploadDocumentCaseAdmin/>} />
          <Route path="/UserManagementAdmin" element={<UserManagementAdmin/>} />
          <Route path="/MyCaseAdmin" element={<MyCaseAdmin/>} />
          <Route path="/CreateMyCaseFormAdmin" element={<CreateMyCaseFormAdmin/>} />
          <Route path="/ViewMyCaseAdmin/:caseId" element={<ViewMyCaseAdmin />} />
          <Route path="/EditMyCaseAdmin/:caseId" element={<EditMyCaseAdmin />} />
          <Route path="/DocumentManagementMyCaseAdmin/:caseId" element={<DocumentManagementMyCaseAdmin/>} />
          <Route path="/UploadDocumentMyCaseAdmin/:caseId" element={<UploadDocumentMyCaseAdmin/>} />
          <Route path="/HomeForClient" element={<HomeForClient/>} />
          <Route path="/CaseManagementClient" element={<CaseManagementClient/>} />
          <Route path="/ViewCaseClient/:caseId" element={<ViewCaseClient/>} />
          <Route path="/DocumentManagementClient/:caseId" element={<DocumentManagementClient/>} />
          <Route path="/ProfileSettingClient" element={<ProfileSettingClient/>} />
          <Route path="/UpdateEmailClient" element={<UpdateEmailClient/>} />
          <Route path="/UpdateNameClient" element={<UpdateNameClient/>} />
          <Route path="/ViewEventClient" element={<ViewEventClient />} />
          <Route path="/EventManagementClient" element={<EventManagementClient />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;