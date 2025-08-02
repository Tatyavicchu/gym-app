import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t shadow-md flex justify-around py-2 z-50">
      {[
        { path: "/", label: "Home" },
        { path: "/exercise", label: "Exercise" },
        { path: "/membership", label: "Membership" },
        { path: "/complaints", label: "Complaints" },
      ].map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `text-sm text-center ${isActive ? "text-blue-600 font-bold" : "text-gray-500"}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
