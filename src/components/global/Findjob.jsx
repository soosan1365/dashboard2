import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
const Findjob = ({ desc, title, bg, title1, desc1, desc2 } = { item }) => {
    return (
        <Card className={`${bg} flex flex-col justify-between`}>
            <CardHeader>
                <CardTitle className="flex flex-col text-white" >
                    <span className="text-4xl from-[#d58edb] ">{title}</span>
                    <span className="text-4xl from-[#d58edb] ">{title1}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-white">
                <p className="text-xl font-semibold">{desc}</p>
                <p className="text-xl font-semibold">{desc1}</p>
                <p className="text-xl font-semibold">{desc2}</p>
            </CardContent>
            <CardFooter>
                <button className="bg-white  rounded-2xl w-full font-semibold py-3.5">Get PRO for $12 per month</button>
            </CardFooter>
        </Card>
    )
}

export default Findjob
