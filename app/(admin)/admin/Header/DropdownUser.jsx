import { useState } from "react";
import Link from "next/link";
import ClickOutside from "@/app/(admin)/admin/ClickOutside";
import { LuSettings } from "react-icons/lu";
import { BiLogOut } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { signOut } from "next-auth/react";
const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <div className="w-10 h-10 rounded-full border-[var(--rv-gray)] border flex items-center justify-center">
          <FaUserCircle size={32} color="var(--rv-bg-primary)"/>
        </div>
      </Link>

      {dropdownOpen && (
        <div
          className={`absolute right-4 mt-2 flex w-[250px] p-4 flex-col gap-2 rounded-lg border-[0.5px] border-[var(--rv-gray)] bg-[var(--rv-bg-white)] shadow-default dark:border-dark-3 dark:bg-[var(--rv-bg-gray)]-dark`}
        >
          <div className="">
            <span className="">
              Admin
            </span>

          </div>
          <ul className="border-t py-2 border-b border-[var(--rv-gray)]">
            <li >
              <Link
                href="/admin/change-password"
                className="flex gap-2 items-center"
              >
                <TbLockPassword  size={20} />
                Change Password
              </Link>
            </li>
          </ul>
          <ul className="border-t py-2 border-b border-[var(--rv-gray)]">
            <li >
              <Link
                href="/admin/site-settings"
                className="flex gap-2 items-center"
              >
                <LuSettings size={20} />
                Site Settings
              </Link>
            </li>
          </ul>
          <div className="">
            <button
              className="flex gap-2 items-center"
              onClick={() => signOut({ callbackUrl: '/signin' })}
              >
              <BiLogOut />
              Logout
            </button>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
