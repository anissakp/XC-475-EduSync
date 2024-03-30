import { useNavigate, useLocation } from "react-router-dom"

export default function CoursePageHeader(){
  // RETRIVE COURSENAME FROM URL 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName');

  const navigate = useNavigate()
  const handleClick = ()=>{
    navigate("/dashboard")
  }

  return (
    <header className="bg-[#EBEDEC] h-[5rem] flex items-center p-6 gap-4 sticky top-0 z-40">
      <button onClick={handleClick} className="bg-[#1E1E26] text-[#D5D2DD]">{"< Dashboard"}</button>
      <h3 className="text-[#353638] font-bold text-4xl">{courseName}</h3>
    </header>
  )
}


