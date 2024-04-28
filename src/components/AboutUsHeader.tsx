import eduSyncLogo from "../assets/edusyncLogo.png"
import { Link } from "react-router-dom";

type HeaderProps = {
    buttonText: string;
    buttonLink: string;
};

export default function AboutUsHeader({ buttonText, buttonLink }: HeaderProps) {
    return (
        <header className="flex justify-between items-center px-11 py-5">
            <img className="w-32 md:w-36 lg:w-40 xl:w-44" src={eduSyncLogo} alt="logo" />
            <nav>
                <ul className="flex items-center gap-3 md:gap-6 xl:gap-9">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About us</Link></li>
                    <li><Link to={buttonLink}><button className="bg-custom-black text-custom-gray2">{buttonText}</button></Link></li>
                </ul>
            </nav>
        </header>
    )
}