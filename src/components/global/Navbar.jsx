"use client"
import { BellRing, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/logo.png"
import selina from "../../../public/selina.jpg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "../ui/sidebar";
import { menuItems } from "@/content/data";
import { usePathname } from "next/navigation";
import Link from "next/link";


const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className="flex justify-between items-center sticky top-0 p-4 z-50 bg-purple-50
      text-gray-800 ">

      {/*left search */}
      <div className="flex justify-center items-center gap-2">
        <Image src={logo} className="rounded-4xl" alt="" width={20} height={20} />
        <h1 className="text-lg font-semibold">Talantium</h1>
        <span className="md:hidden flex justify-center items-center"><SidebarTrigger className="md:hidden" />Menu</span></div>
      <div className="flex gap-5 justify-center items-center">
        {menuItems.map((item, index) => (

          <Link key={index} href={item.href} className={`hidden md:block
                 ${pathname == item.href ? "border-[1px] border-gray-400 py-1 px-2  rounded-4xl " : ""}`}>
            <span className="relative text-gray-800">{item.lable}</span>
            {
              item.lable === "Massages" ? (
                <span className="absolute top-6 bg-red-500 w-2 h-2 rounded-full"></span>) : ""
            }
          </Link>

        ))}
      </div>
      {/* right  */}
      <div className=" flex justify-end  items-center gap-3  ">
        <span className="border border-gray-100 rounded-4xl p-[9px]"><Settings className="w-5 h-5" /></span>
        <span className="border rounded-full p-2 relative  ">
          <BellRing className="w-5 h-5 " />
          <span className="absolute rounded-full w-2 h-2 
           text-white flex justify-center items-center 
           top-0.5 right-1 text-sm bg-red-500"></span>
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Image src={selina} width={32} height={32} alt="" className=" rounded-full border-2   border-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOut />
              LogOut
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


      </div>
    </div>
  );
};

export default Navbar;
