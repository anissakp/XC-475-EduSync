import eduSyncLogo from "../assets/edusyncLogo.png"
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="flex justify-between items-center px-11 py-5">
      <img className="w-32 md:w-36 lg:w-40 xl:w-44" src={eduSyncLogo} alt="logo"/>
      <nav>
        <ul className="flex items-center gap-3 md:gap-6 xl:gap-9">
          <li>About us</li>
          <li><Link to="/login"><button className="bg-custom-black text-custom-gray2">LOGIN</button></Link></li>
        </ul>
      </nav>
    </div>
  )
}