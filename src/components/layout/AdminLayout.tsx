import { Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-surface-light p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;