import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import Image from "next/image"
const CartItem = ({price,title,company,country,date,workSchedule,workStyle,srcheart,experience,srclogo,applicants,bg}={item}) => {
  return (
    <Card className={bg}>
  <CardHeader>
    <CardTitle ><span className="text-2xl  ">${price}</span>/month</CardTitle>
   
  </CardHeader>
  <CardContent className="flex justify-between items-center">
    <div >
     <p className="text-xl font-semibold">{title}</p>
    <p>{company}</p></div>
    <Image src={srclogo} alt="" width={50} height={50} className="rounded-xl"/></CardContent>
    <CardContent className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 ">
    <span className="flex gap-3 items-center "><MapPin className="text-gray-600"/>{country}</span>
    <div>
       <span className="flex gap-3 items-center "><Clock className="text-gray-600"/>{date} <span>.{applicants}</span></span>
      
       </div>
   </div>

    <div className="flex gap-2 ">
        <button className="border-2 border-black/12 py-1 px-3 rounded-full">{workSchedule}</button>
        <button className="border-2 border-black/12 py-1 px-3 rounded-full">{workStyle}</button>
        <button className="border-2 border-black/12 py-1 px-3 rounded-full">{experience}</button>
    </div>
  </CardContent>
  <CardFooter>
    <button className="bg-black  rounded-2xl w-full text-white py-3.5">Apply now</button>
    <button className="border-2 ml-2 border-gray-400  p-3 rounded-2xl"><Image className="" src={srcheart} alt="" width={30} height={30}/></button>
  </CardFooter>
</Card>
  )
}

export default CartItem
