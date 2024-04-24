import AboutUsHeader from "../components/AboutUsHeader"
import Footer from "../components/Footer";
import MeetTheTeam from "./MeetTheTeam";


export default function AboutUs() {
    return (
        <div>
            <AboutUsHeader buttonText="LOGIN" buttonLink="/login" />
            {/* About us section */}

            <div className="flex flex-col justify-center items-center gap-9 p-16">
                {/* About Us header text */}
                <div className="text-6xl flex flex-row gap-3">
                    <p className="text-center">About  <span className="  text-[#99C8CD]"> us</span></p>
                </div>
                {/* story and mission section */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div>
                        <div className="bg-[#99C8CD] w-full lg:w-96 p-2.5 rounded-md font-bold ">Our Story</div>
                        <p className="w-96 p-4 "> As students, we've noticed we use numerous websites for school tasks  each year. Many serve just one purpose, like forums or homework  submission. Professors often use different platforms, making it hard to  keep track. We believe there should be a simpler way to stay organized  and manage school information.</p>
                    </div>
                    <div>
                        <div className="bg-[#E1AB91] w-full lg:w-96 p-2.5 rounded-md font-bold">Our Mission</div>
                        <p className="w-96 p-4">Our goal is to help student reach academic success. By providing one place where students can see all their course information, our solution helps students stay organized, reduce stress and have more time to focus on their school work rather than managing different student platforms </p>
                    </div>
                </div>


            </div>


            {/* Meet the team section */}
            <MeetTheTeam />

            <Footer />

        </div>

    );

}