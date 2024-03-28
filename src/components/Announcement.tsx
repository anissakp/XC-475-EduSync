import { AuthContext } from "../authContext" ;
import { useContext, useEffect, useState } from "react";
import parse from 'html-react-parser';

interface Props {
  courseID: string
};

const Announcement: React.FC<Props> = ({courseID}) => {
  const [annoucements, setAnnoucements] = useState([])
  const auth = useContext(AuthContext);

  const getAnnouncement = async () => {
    const bbAnnouncementUrl = import.meta.env.VITE_BB_ANNOUNCEMENT_URL;
    console.log("INVOKED", bbAnnouncementUrl, auth.token, courseID)
    const result = await fetch(bbAnnouncementUrl, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        courseId: courseID,
      },
    });
    const data = await result.json()
    setAnnoucements(data.results)
    console.log("ANNOUNCEMENT DATA", data.results)
  }

  useEffect(() => {
    console.log(auth.token);
    if (auth.token) {
      getAnnouncement()
    } 
  }, [auth.token, auth.userID]);


  const displayAnnouncements = !annoucements ? [] : annoucements.map((elem)=> <div className="text-center mb-5 p-2 bg-custom-gray2 rounded-2xl"><div>{elem.title}</div><div className="text-center">{parse(elem.body)}</div></div>)

  return (
     <div className="col-span-1 h-96 sm:col-span-1 md:h-auto md:col-span-3 overflow-y-auto rounded-tl-lg rounded-tr-lg bg-gradient-custom2 relative">
        <h3 className="bg-custom-gray2 px-5 py-2 rounded-tl-lg rounded-tr-lg sticky top-0 z-10">Course Announcements</h3>
        <div className="p-5">{displayAnnouncements}</div>
     </div>
  )
}

export default Announcement