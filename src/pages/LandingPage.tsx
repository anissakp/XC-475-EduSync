import React from 'react'
import thinkingSyd from "../assets/thinkingSyd.png"
import studyingSyd from "../assets/studyingSyd.png"
import serviceSyd from "../assets/serviceSyd.png"
import Navigation from '../components/Navigation'


export default function LandingPage() {
  return (
    <>
      <Navigation/>
      <div className="flex justify-center items-center">
        <img src={thinkingSyd} alt="Logo" />
        <div>
          <h2 className="text-4xl">Syd <span className="text-custom-orange">always</span> forgets <span className="text-custom-blue">important</span> academic dates</h2>
          <p>Are you like Syd?</p>
          <p>We're here to help you?</p>
          <button>Get Started, it's Free!</button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <p>
          EduSync aids college students in achieving academic success 
          by streamlining various student platforms and assisting them 
          in organizing their class materials.
        </p>
        <img src={studyingSyd} alt="Logo" />
      </div>
      <img src={serviceSyd} alt="Logo" />
    </>
   
   
  )
}
