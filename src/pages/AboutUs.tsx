import AboutUsHeader from "../components/about-us/AboutUsHeader";
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
                        <p className="w-96 p-4 "> As students, we find ourselves using a variety of platforms for academic tasks each year. Many of these platforms are specialized, serving singular functions such as forums or homework submission. Professors frequently choose different platforms, which complicates our ability to keep track of everything. We think there should be an easier method to stay organized and manage school-related information.</p>
                    </div>
                    <div>
                        <div className="bg-[#E1AB91] w-full lg:w-96 p-2.5 rounded-md font-bold">Our Mission</div>
                        <p className="w-96 p-4">Our goal is to assist students in achieving academic success. Our solution offers a single location where students can access all their course information, helping them stay organized and reduce stress. This allows them more time to concentrate on their studies instead of juggling various learning platforms.</p>
                    </div>
                </div>


            </div>


            {/* Meet the team section */}
            <MeetTheTeam />

            <Footer />

        </div>

    );

}