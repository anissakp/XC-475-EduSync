import React from 'react'
import thinkingSyd from "../assets/thinkingSyd.png"
import studyingSyd from "../assets/studyingSyd.png"
import Navigation from '../components/Navigation'
import blueblob from "../assets/blueblob.png"
import orangeblob from "../assets/orangeblob.png"
import yellowblob from "../assets/yellowblob.png"
import sydTreasure from "../assets/sydtreasure.png"


export default function LandingPage() {
  return (
    <>
      <Navigation/>
      <div className="flex flex-col md:flex-row justify-center items-center px-11 gap-6 mt-10">
        <div className="relative flex-shrink-0">
          <img className="relative z-10 w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600"  src={thinkingSyd} alt="Logo" />
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
       <div className="relative">
          <p className="text-xs	md:text-base rounded-3xl max-w-52	md:max-w-xs lg:max-w-sm bg-custom-gray absolute left-[-7rem] bottom-[5rem] md:left-[-16rem] md:bottom-[7rem] lg:left-[-14rem] lg:bottom-1/3 z-20 px-8 py-6 lg:px-14 lg:py-12">
            EduSync aids college students in achieving academic success 
            by streamlining various student platforms and assisting them 
            in organizing their class materials.
          </p> 
          <img className="absolute top-[-2rem] left-[-10rem] md:left-[-19rem] lg:left-[-24rem]" src={blueblob} alt="Logo" />
          <img className="z-30 relative w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600 lg:mr-32 xl:mr-36" src={studyingSyd} alt="Logo" />
       </div>
      </div>
      <div className="flex justify-center mt-20">
        <div className="relative text-black text-xs">
          <img className="w-300 sm:w-300 md:w-400 lg:w-500 xl:w-600 relative z-10" src={sydTreasure} alt="Logo" />
          <img className="absolute left-[-5rem] top-[-10rem] z-0" src={yellowblob} alt="blob"/>
          <img className="absolute left-[-10rem] bottom-[-2rem] z-0" src={yellowblob} alt="blob"/>
          <img className="absolute right-[-10rem] bottom-[-2rem] z-0" src={yellowblob} alt="blob"/>
          <div className="absolute z-20 top-[-2rem] left-[0rem] w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-2xl">Notes</h2><p className="text-xs">Take both quick and more detailed notes</p></div>
          <div className="absolute z-20 left-[-4rem] bottom-1/3  w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-2xl">Notifications</h2><p>Stay alerted</p></div>
          <div className="absolute z-20 right-[0rem] top-[-2rem] w-28 h-28 md:w-40 md:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-2xl">Tasks</h2><p>Remember, Prioritize, and Get Done</p></div>
          <div className="absolute z-20 right-[-4rem] bottom-1/3  w-28 h-28 md:w-40 md:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-2xl">Community</h2><p>Share and discover others POVs</p></div>
          <div className="absolute z-20 bottom-0 left-[0rem]  w-28 h-28 md:w-40 md:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-2xl">Calendar</h2><p>Manage your time and stay Up to Date</p></div>
          <div className="absolute z-20 bottom-0 right-[0rem] w-28 h-28 md:w-40 md:h-40  bg-white rounded-full flex flex-col items-center justify-center text-center p-4"><h2 className="font-bold md:text-2xl">Course Integration</h2><p>Connect to different learning platforms</p></div>
        </div>
      </div>
      
    </>
   
   
  )
}
