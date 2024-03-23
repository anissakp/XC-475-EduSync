import React from 'react'
import thinkingSyd from "../assets/thinkingSyd.png"
import studyingSyd from "../assets/studyingSyd.png"
import Header from '../components/Header'
import blueblob from "../assets/blueblob.png"
import orangeblob from "../assets/orangeblob.png"
import yellowblob from "../assets/yellowblob.png"
import sydTreasure from "../assets/sydtreasure.png"
import Footer from '../components/Footer'
import computerSyd from "../assets/sydComputer.png"
import calendar from "../assets/calendar.png"
import aplus from "../assets/Aplus.png"
import assignment from "../assets/assignment.png"
import hat from "../assets/hat.png"


export default function LandingPage() {
  return (
    <>
      <Header/>
      <div className="flex flex-col md:flex-row justify-center items-center px-11 gap-6 mt-10">
        <div className="relative flex-shrink-0">
          <img className="animate-wiggle1 relative z-10 w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600"  src={thinkingSyd} alt="Logo" />
          <img className="absolute left-[-3rem] top-[-3rem] xl:left-[-8rem] xl:top-[-8rem] z-0 w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600" src={yellowblob} alt="blob"/>
          <img className="absolute left-[-2rem] bottom-[-1rem] xl:left-[-4rem] xl:bottom-[-4rem] z-0 w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600" src={orangeblob} alt="blob"/>
        </div>
        
        <div className="max-w-sm flex flex-col gap-3 ">
          <h2 className="text-2xl xl:text-4xl text-center md:text-left">Syd <span className="text-custom-orange">always</span> forgets <span className="text-custom-blue">important</span> academic dates</h2>
          <p className="text-center md:text-left">Are you like Syd? <br></br> We're here to help you!</p>
          <button className="bg-custom-blue2 ">Get Started, it's Free!</button>
        </div>
      </div>
      <div className=" flex justify-end md:justify-end items-center px-11 mt-20 ">
       <div className="relative xl:mr-28">
          <p className="text-xs	md:text-base rounded-3xl max-w-52	md:max-w-xs lg:max-w-sm bg-custom-gray absolute left-[-7rem] bottom-[5rem] md:left-[-16rem] md:bottom-[7rem] lg:left-[-14rem] lg:bottom-1/3 z-20 px-8 py-6 lg:px-14 lg:py-12">
            EduSync aids college students in achieving academic success 
            by streamlining various student platforms and assisting them 
            in organizing their class materials.
          </p> 
          <img className="absolute top-[-2rem] left-[-10rem] md:left-[-19rem] lg:left-[-24rem]" src={blueblob} alt="Logo" />
          <img className="absolute right-[-2rem] top-[3rem] xl:left-[-8rem] xl:top-[-8rem] z-0 w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600" src={yellowblob} alt="blob"/>
          <img className="z-30 relative w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600 lg:mr-32 xl:mr-36" src={computerSyd} alt="Logo" />
          <img className="animate-wiggle1 z-40 absolute top-[3rem] right-[3rem] w-20 sm:w-20 md:w-28 lg:w-36 xl:w-40 lg:mr-32 xl:mr-36" src={calendar} alt="Logo" />
          <img className="animate-wiggle2 z-40 absolute top-[2rem] right-[0.5rem] lg:top-[3rem] lg:right-[-1rem] xl:top-[2.5rem] xl:right-[-2.5rem] w-8 sm:w-8 md:w-9 lg:w-12 xl:w-16 lg:mr-32 xl:mr-36" src={aplus} alt="Logo" />
          <img className="animate-wiggle3 z-40 absolute top-[8rem] right-[1rem] md:top-[11rem] md:right-[1rem] lg:top-[14rem] lg:right-[2rem] xl:top-[15rem] xl:right-[2rem] w-14 sm:w-14 md:w-20 lg:w-28 xl:w-32 lg:mr-32 xl:mr-36" src={assignment} alt="Logo" />
          <img className="animate-wiggle4 z-40 absolute top-[9rem] right-[5rem] md:top-[13rem] md:right-[7rem] lg:top-[16rem] lg:right-[9rem] xl:top-[18rem] xl:right-[11rem] w-14 sm:w-14 md:w-16 lg:w-20 xl:w-24 lg:mr-32 xl:mr-36" src={hat} alt="Logo" />


       </div>
      </div>
      <div className="flex justify-center mt-24 md:mt-28 lg:mt-32 xl:mt-36">
        <div className="relative text-black text-xs ">
          <img className="w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600 relative z-10" src={sydTreasure} alt="Logo" />
          <img className="absolute left-[-4rem] top-[-5rem] z-0" src={yellowblob} alt="blob"/>
          <img className="absolute left-[-5rem] bottom-[-2rem] z-0" src={yellowblob} alt="blob"/>
          <img className="absolute right-[-5rem] bottom-[-2rem] z-0" src={yellowblob} alt="blob"/>
          <img className="absolute right-[-5rem] top-[-5rem] z-0" src={yellowblob} alt="blob"/>
          <div className="absolute z-20 top-[-2rem] left-[0rem] w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-lg">Notes</h2><p className="text-xs">Take both quick and more detailed notes</p></div>
          <div className="absolute z-20 left-[-4rem] bottom-1/3  w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-lg">Notifications</h2><p>Stay alerted</p></div>
          <div className="absolute z-20 right-[0rem] top-[-2rem] w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36  xl:w-40 xl:h-40 bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-lg">Tasks</h2><p>Remember, Prioritize, and Get Done</p></div>
          <div className="absolute z-20 right-[-4rem] bottom-1/3  w-28 h-28 md:w-32 md:h-32  lg:w-36 lg:h-36 xl:w-40 xl:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-lg">Community</h2><p>Share and discover others POVs</p></div>
          <div className="absolute z-20 bottom-[-2rem] left-[0rem]  w-28 h-28 md:w-32 md:h-32  lg:w-36 lg:h-36 xl:w-40 xl:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-lg">Calendar</h2><p>Manage your time and stay Up to Date</p></div>
          <div className="absolute z-20 bottom-[-2rem] right-[0rem] w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-lg">Course Integration</h2><p>Connect to different learning platforms</p></div>
        </div>
      </div>
      <Footer/>
    </>
   
   
  )
}
