"use client"
// import Image from "next/image";
// import Link from "next/link";
// import { logoutsSettingMenu } from "../../content/data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { categories, categories1, categories2, categories3 } from "@/content/data";
import Image from "next/image";
import { useState } from "react";
import chart from "../../../public/chart.jpg"
import { Button } from "../ui/button";
import { DollarSign, DollarSignIcon } from "lucide-react";


const AppSidebar = () => {

  // const [selectedCategories, setSelectedCategories] = useState([]);

  // const handleCheckboxChange = (category) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(category)
  //       ? prev.filter((c) => c !== category)
  //       : [...prev, category]
  //   );
  // };


  return (

    <Sidebar className=" pl-1 pt-4 mt-17 ">
      <SidebarHeader className=" ml-4 mt-1  ">
        <div className="flex w-full justify-between items-center ">
          <h1 className="font-semibold  md:text-xl">Filters</h1>
          <p className="text-purple-400 font-semibold pr-3 ">Reset all</p></div>
      </SidebarHeader>
      <SidebarContent className="px-3 ">
        <SidebarGroup className="gap-5 mt-5">
          <SidebarMenu>
            <h1 className="font-semibold">Work schedule</h1>
            {categories1.map((item, index) => (
              <SidebarMenuItem key={item.categorie}>
                <SidebarMenuButton key={index} asChild>
                  <label className="flex  space-x-1 items-center ">
                    <input
                      type="checkbox"
                     className="h-4 w-4"
                    />
                    <span>{item.categorie}</span>
                  </label>
                </SidebarMenuButton>

              </SidebarMenuItem>

            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup >
          <h1 className="font-semibold"> Slary range</h1>
          <Image src={chart} width={500} height={500} alt="" className="rounded-4xl mt-3" />
          <div className=" flex justify-center gap-1.5  ">
            <Button variant="outline" size="lg"><span>2,500 </span><DollarSignIcon/></Button>
            <Button variant="outline" size="lg"><span>10,000</span><DollarSignIcon/></Button>
          </div>
        </SidebarGroup>
            <SidebarGroup className="gap-5 mt-5">
          <SidebarMenu>
            <h1 className="font-semibold">Employment type</h1>
            {categories2.map((item, index) => (
              <SidebarMenuItem key={item.categorie}>
                <SidebarMenuButton key={index} asChild>
                  <label className="flex  space-x-1 items-center">
                    <input
                      type="checkbox"
                    
                    />
                    <span>{item.categorie}</span>
                  </label>
                </SidebarMenuButton>

              </SidebarMenuItem>

            ))}
          </SidebarMenu>
        </SidebarGroup>
           <SidebarGroup className="gap-5 mt-5 mb-10">
          <SidebarMenu>
            <h1 className="font-semibold">Employment type</h1>
            {categories3.map((item, index) => (
              <SidebarMenuItem key={item.categorie}>
                <SidebarMenuButton key={index} asChild>
                  <label className="flex  space-x-1 items-center">
                    <input
                      type="checkbox"
                    
                    />
                    <span>{item.categorie}</span>
                  </label>
                </SidebarMenuButton>

              </SidebarMenuItem>

            ))}
          </SidebarMenu>
        </SidebarGroup>
              </SidebarContent>
      {/* <SidebarFooter  className="gap-5  mt-5">
        <SidebarMenu>
          {logoutsSettingMenu.map((item, index) => (
             <SidebarMenuItem  key={index}>
              <SidebarMenuButton asChild>
            <Link  href={item.href} className={`
         ${pathname == item.href ? "  bg-black text-white  " : ""}`}>
              <Image src={item.icon}  className={`${pathname == item.href ? " bg-white  " : ""}`} alt="" width={17} height={10} />
              <span >{item.lable}</span>
            </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>



  );
};

export default AppSidebar;
