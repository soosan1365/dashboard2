"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { categories, categories1, categories2, categories3 } from "@/content/data";
import Image from "next/image";
import { useState } from "react";
import SalaryChart from "@/components/global/SalaryChart";
import { DollarSignIcon } from "lucide-react";


const AppSidebar = ({ onSalaryChange, onFiltersChange } = {}) => {
  // salary state and category selections
  const [minSalary, setMinSalary] = useState(2500);
  const [maxSalary, setMaxSalary] = useState(10000);

  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState([]);
  const [selectedWorkStyle, setSelectedWorkStyle] = useState([]);

  const emitFilters = (next) => {
    onFiltersChange?.(next);
    try {
      if (typeof window !== "undefined" && window?.CustomEvent) {
        window.dispatchEvent(new CustomEvent("filtersChanged", { detail: next }));
      }
    } catch (e) {}
  };

  const editMin = () => {
    try {
      const raw = window.prompt("Set minimum salary:", String(minSalary || 0));
      if (raw === null) return;
      const v = Number(raw.replace(/,/g, "") || 0);
      setMinSalary(v);
      emitFilters({ schedule: selectedSchedule, employment: selectedEmployment, workStyle: selectedWorkStyle, salary: { min: v, max: maxSalary } });
    } catch (e) {}
  };

  const editMax = () => {
    try {
      const raw = window.prompt("Set maximum salary:", String(maxSalary || 0));
      if (raw === null) return;
      const v = Number(raw.replace(/,/g, "") || 0);
      setMaxSalary(v);
      emitFilters({ schedule: selectedSchedule, employment: selectedEmployment, workStyle: selectedWorkStyle, salary: { min: minSalary, max: v } });
    } catch (e) {}
  };

  const resetAll = () => {
    setSelectedSchedule([]);
    setSelectedEmployment([]);
    setSelectedWorkStyle([]);
    setMinSalary(2500);
    setMaxSalary(10000);
    emitFilters({ schedule: [], employment: [], workStyle: [], salary: { min: 2500, max: 10000 } });
  };

  return (

    <Sidebar className=" pl-1 pt-4 mt-17 ">
      <SidebarHeader className=" ml-4 mt-1  ">
        <div className="flex w-full justify-between items-center ">
          <h1 className="font-semibold  md:text-xl">Filters</h1>
          <button onClick={resetAll} className="text-purple-400 font-semibold pr-3">Reset all</button>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 ">
        <SidebarGroup className="gap-5 mt-5">
          <SidebarMenu>
            <h1 className="font-semibold">Work schedule</h1>
            {categories1.map((item, index) => {
              const checked = selectedSchedule.includes(item.categorie);
              return (
                <SidebarMenuItem key={item.categorie}>
                  <SidebarMenuButton key={index} asChild>
                    <label className="flex  space-x-1 items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={() => {
                          const next = checked ? selectedSchedule.filter((s) => s !== item.categorie) : [...selectedSchedule, item.categorie];
                          setSelectedSchedule(next);
                          emitFilters({ schedule: next, employment: selectedEmployment, workStyle: selectedWorkStyle, salary: { min: minSalary, max: maxSalary } });
                        }}
                      />
                      <span>{item.categorie}</span>
                    </label>
                  </SidebarMenuButton>

                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <h1 className="font-semibold"> Salary range</h1>
          <SalaryChart
            min={minSalary}
            max={maxSalary}
            onEditMin={editMin}
            onEditMax={editMax}
          />
        </SidebarGroup>
            <SidebarGroup className="gap-5 mt-5">
          <SidebarMenu>
            <h1 className="font-semibold">Employment type</h1>
            {categories2.map((item, index) => (
                <SidebarMenuItem key={item.categorie}>
                  {(() => {
                    const checked = selectedEmployment.includes(item.categorie);
                    return (
                      <SidebarMenuButton key={index} asChild>
                        <label className="flex  space-x-1 items-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked ? selectedEmployment.filter((s) => s !== item.categorie) : [...selectedEmployment, item.categorie];
                              setSelectedEmployment(next);
                              emitFilters({ schedule: selectedSchedule, employment: next, workStyle: selectedWorkStyle, salary: { min: minSalary, max: maxSalary } });
                            }}
                          />
                          <span>{item.categorie}</span>
                        </label>
                      </SidebarMenuButton>
                    );
                  })()}
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
           <SidebarGroup className="gap-5 mt-5 mb-10">
          <SidebarMenu>
            <h1 className="font-semibold">Employment type</h1>
            {categories3.map((item, index) => (
                <SidebarMenuItem key={item.categorie}>
                  {(() => {
                    const checked = selectedWorkStyle.includes(item.categorie);
                    return (
                      <SidebarMenuButton key={index} asChild>
                        <label className="flex  space-x-1 items-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked ? selectedWorkStyle.filter((s) => s !== item.categorie) : [...selectedWorkStyle, item.categorie];
                              setSelectedWorkStyle(next);
                              emitFilters({ schedule: selectedSchedule, employment: selectedEmployment, workStyle: next, salary: { min: minSalary, max: maxSalary } });
                            }}
                          />
                          <span>{item.categorie}</span>
                        </label>
                      </SidebarMenuButton>
                    );
                  })()}
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
              </SidebarContent>
  
    </Sidebar>



  );
};

export default AppSidebar;
