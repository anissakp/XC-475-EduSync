import { useState, useEffect } from "react";



export default function GSLoginPage() {
  const connectGS = async ()=>{
    const result = await fetch("http://127.0.0.1:5001/edusync-e6e17/us-central1/getGSConnection");
    const data = await result.json()
    console.log(data)
  }

  return <button onClick={connectGS}>Submit</button>
  
}
