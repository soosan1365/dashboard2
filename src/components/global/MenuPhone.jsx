"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Image from "next/image";
import logo from "../../../public/logo.png"
import { menuItems } from "../../content/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuPhone = () => {
    const pathname = usePathname()

    return (
        <div>
            <Sheet>
                <SheetTrigger><MenuIcon className="block md:hidden" /></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            <div className="flex justify-start items-center gap-3">
                                <Image src={logo} className="rounded-4xl" alt="" width={20} height={20} />
                                <h1 className="text-lg font-semibold">Talantium</h1></div>
                        </SheetTitle>
                        < SheetDescription>
                            <div className="flex flex-col gap-5 justify-center mt-10 ml-5  text-base font-semibold">
                                {menuItems.map((item, index) => (

                                    <Link key={index} href={item.href} className={`
                                         ${pathname == item.href ? "bg-purple-200 w-fit pl-1 pr-5 py-1 border-gray-900  rounded-4xl" : ""}`}>
                                        <div>

                                            <span className=" relative text-gray-800 ">{item.lable}</span>

                                            {
                                                item.lable === "Massages" ? (
                                                    <span className="absolute hidden md:block top-6 bg-red-500 w-2 h-2 rounded-full"></span>) : ""
                                            }</div>
                                    </Link>
                                ))}
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MenuPhone
