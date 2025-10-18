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
import MenuPhone from "./MenuPhone";


const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className="flex justify-between items-center sticky top-0 p-4 z-50 bg-purple-50
      text-gray-800 ">

      {/* left: logo/title */}
      <div className="flex items-center gap-2">
        <Image src={logo} className="rounded-4xl" alt="Talantium" width={28} height={28} />
        <h1 className="text-lg font-semibold">Talantium</h1>
        {/* sidebar trigger for small screens */}
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </div>

      {/* center: main nav links (hidden on small screens) */}
      <div className="hidden md:flex flex-1 gap-5 justify-center items-center">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`px-3 py-1 rounded-4xl text-gray-800 font-medium ${pathname == item.href ? "border-[1px] border-gray-400 bg-white" : "hover:bg-gray-100"}`}>
            <span className="relative inline-block">
              {item.lable}
              {item.lable === "Massages" ? (
                <span className="absolute -top-1 -right-2 bg-red-500 w-2 h-2 rounded-full" />
              ) : null}
            </span>
          </Link>
        ))}
      </div>
      {/* right  */}
      <div className=" flex justify-center items-center gap-2">
        
        <span className="border border-gray-100 rounded-4xl p-[9px]"><Settings className="w-5 h-5" /></span>
        <div className="border rounded-full p-2 relative  ">
          <BellRing className="w-5 h-5 " />
          <span className="absolute rounded-full w-2 h-2 
           text-white flex justify-center items-center 
           top-0.5 right-1 text-sm bg-red-500"></span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex justify-center items-center gap-2">
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
  <MenuPhone />
       </div>

      </div>
  
  )
}

export default Navbar;
