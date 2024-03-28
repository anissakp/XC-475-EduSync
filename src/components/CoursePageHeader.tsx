import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

export default function CoursePageHeader(){
  const {courseName} = useParams()
  const navigate = useNavigate()
  const handleClick = ()=>{
    navigate("/dashboard")
  }

  return (
    <header className="bg-[#EBEDEC] h-[4rem] flex items-center p-6 gap-4">
      <button onClick={handleClick} className="bg-[#1E1E26] text-[#D5D2DD]">{"< Dashboard"}</button>
      <h3 className="text-[#353638] font-bold text-4xl">{courseName}</h3>
    </header>
  )
}


