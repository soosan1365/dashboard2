import { Search } from "lucide-react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { carts } from "@/content/data";
import CartItem from "@/components/global/CartItem";
import Findjob from "@/components/global/Findjob";

function Jobs() {
  return (
    <div className="w-full">
      <div className="w-full pt-4 px-2 flex justify-between items-center ">
        {/* header */}
        {/* left */}
        <div className=" w-full flex flex-col justify-between sm:flex-row gap-2">
          <div className=" w-full flex items-center gap-3 ">
            <span className="border-2 border-gray-100 rounded-4xl text-black p-3 ">
              <Search className="text-gray-800" />
            </span>
            <span className="text-xl font-semibold text-gray-700">
              UX/UI Designer
            </span>
          </div>
          {/* right */}
          <div className=" w-full flex justify-around max-w-[85%] mx-auto  sm:justify-end items-center gap-2 text-gray-800  ">
            <button
              variant="ghost"
              className="flex justify-center items-center whitespace-nowrap  py-1  px-2 md:px-4 border-2 border-black/55 rounded-full text-base  "
            >
              United State
              <IoCloseCircleSharp className=" text-2xl ml-2" />
            </button>
            <button
              variant="ghost"
              className="flex justify-center items-center  whitespace-nowrap py-1 px-2 md:px-4 border-2 border-black/55 rounded-full text-base"
            >
              5+ years experience
              <IoCloseCircleSharp className="text-2xl ml-2" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 max-w-[85%]  mx-auto md:max-w-[100%] md:grid-cols-2 lg:grid-cols-3 gap-2 px-3 py-4">
        {carts.map((item, index) => {
          if (item.title === "Find your") {
            return <Findjob key={index} {...item} />;
          } else {
            return <CartItem key={index} {...item} />;
          }
        })}
      </div>
    </div>
  );
}

export default Jobs;
