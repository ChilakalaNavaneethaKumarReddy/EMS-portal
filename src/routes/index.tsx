import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "@/layouts/MainLayout"
import { AdminLayout } from "@/layouts/AdminLayout"
import { Landing } from "@/pages/Landing"
import { Dashboard } from "@/pages/Dashboard"
import { Jobs } from "@/pages/Jobs"
import { JobDetail } from "@/pages/JobDetail"
import { Schemes } from "@/pages/Schemes"
import { SchemeDetail } from "@/pages/SchemeDetail"
import { Notifications } from "@/pages/Notifications"
import { AIAssistant } from "@/pages/AIAssistant"
import { Profile } from "@/pages/Profile"
import { Login } from "@/pages/Login"
import { NotFound } from "@/pages/NotFound"
import { Echs } from "@/pages/Echs"
import { Pension } from "@/pages/Pension"
import { Helplines } from "@/pages/Helplines"
import { About } from "@/pages/About"
import { AdminOverview } from "@/pages/admin/AdminOverview"
import { AdminJobs } from "@/pages/admin/AdminJobs"
import { AdminSchemes } from "@/pages/admin/AdminSchemes"
import { AdminUpdates } from "@/pages/admin/AdminUpdates"
import { AdminSyncLogs } from "@/pages/admin/AdminSyncLogs"
import { AdminDataSources } from "@/pages/admin/AdminDataSources"

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/jobs/:id", element: <JobDetail /> },
      { path: "/schemes", element: <Schemes /> },
      { path: "/schemes/:id", element: <SchemeDetail /> },
      { path: "/updates", element: <Notifications /> },
      { path: "/assistant", element: <AIAssistant /> },
      { path: "/profile", element: <Profile /> },
      { path: "/login", element: <Login /> },
      { path: "/echs", element: <Echs /> },
      { path: "/pension", element: <Pension /> },
      { path: "/helplines", element: <Helplines /> },
      { path: "/about", element: <About /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "sources", element: <AdminDataSources /> },
      { path: "jobs", element: <AdminJobs /> },
      { path: "schemes", element: <AdminSchemes /> },
      { path: "updates", element: <AdminUpdates /> },
      { path: "logs", element: <AdminSyncLogs /> },
    ],
  },
  { path: "*", element: <NotFound /> },
])
