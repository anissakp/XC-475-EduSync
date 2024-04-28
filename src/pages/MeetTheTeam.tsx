import { FunctionComponent } from "react";
import styles from "./FrameComponent.module.css";


export default function MeetTheTeam() {
    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-9 p-16">
                {/* Meet the team header text */}
                <div className="text-6xl flex flex-row gap-3">
                    <p className="text-center">Meet the <span className="text-[#E1AB91]">team</span></p>
                </div>
                {/* images section */}
                <div className="flex flex-col lg:flex-row gap-6 ">
                    {/* Anissa's image */}
                    <div className="flex flex-col items-center gap-4">
                        <img src="Anissa.png" alt="drawing of anissa patel" className="w-48 h-48" />
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-xl">Anissa Patel</p>
                            <p>Computer Science ‘25</p>
                            <p>Innovator - Technical</p>
                        </div>
                    </div>

                    {/* Shaimaa's image */}
                    <div className="flex flex-col items-center gap-4 ">
                        <img src="Shaimaa.png" alt="drawing of Shaimaa Sabbagh" className="w-48 h-48" />
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-xl">Shaimaa Sabbagh</p>
                            <p>Computer Science ‘24</p>
                            <p>Innovator - UX Designer</p>
                        </div>
                    </div>

                    {/* Emily's image */}
                    <div className="flex flex-col items-center gap-4">
                        <img src="Emily.png" alt="drawing of Emily Doherty" className="w-48 h-48" />
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-xl">Emily Doherty</p>
                            <p>Computer Science ‘24</p>
                            <p>Technical Teammate</p>
                        </div>
                    </div>

                    {/* Samantha's image */}
                    <div className="flex flex-col items-center gap-4">
                        <img src="Samantha.png" alt="drawing of Samantha Peng" className="w-48 h-48" />
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-xl">Samantha Peng</p>
                            <p>Computer Science ‘26</p>
                            <p>Technical Teammate</p>
                        </div>
                    </div>

                    {/* Zai's image */}
                    <div className="flex flex-col items-center gap-4">
                        <img src="Zai.png" alt="drawing of Zai Sugino" className="w-48 h-48" />
                        <div className="flex flex-col items-center ">
                            <p className="font-bold text-xl">Zai Sugino</p>
                            <p>Computer Science ‘25</p>
                            <p>Technical Teammate</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );

}