import TextField from '@mui/material/TextField';
import Footer from '../components/Footer';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function EditProfile () {

    const [selectedImage, setSelectedImage] = useState('profile pic.svg');

    const handleImageClick = (imageUrl:string ) => {
        setSelectedImage(imageUrl);
    };
    const navigate = useNavigate() 

    const goToDashboard = () => {
        navigate('/dashboard')
    }
    return (
        <div className='flex flex-col '>
            
            <div className="flex justify-between h-[100px] items-center">
                <img className='w-[238px] ml-10' src="mainLogo2.png"/>
                <button onClick={goToDashboard}className="bg-black text-white  mr-10">{"< Dashboard"}</button>
            </div>

            <div className='flex ml-auto mr-auto gap-[101px] mt-[70px]'>
                <div className='w-[352px]' >
                    <img src={selectedImage}className='w-[322px] h-[322px] bg-gray-300 rounded-full'></img>
                    <div className='grid grid-cols-3 gap-[20px] mt-[20px]'>
                        <img onClick={() => handleImageClick('profile pic.svg')} src="profile pic.svg"className='w-[90px] h-[90px] bg-gray-300 rounded-full'/>
                        <img onClick={() => handleImageClick('susan1.png')} src="susan1.png"className='w-[90px] h-[90px] bg-gray-300 rounded-full'/>
                        <img onClick={() => handleImageClick('susan2.png')} src="susan2.png"className='w-[90px] h-[90px] bg-gray-300 rounded-full'/>
                        <img onClick={() => handleImageClick('susan3.png')} src="susan3.png"className='w-[90px] h-[90px] bg-gray-300 rounded-full'/>
                        <img onClick={() => handleImageClick('susan4.png')} src="susan4.png"className='w-[90px] h-[90px] bg-gray-300 rounded-full'/>
                        <img onClick={() => handleImageClick('susan5.png')} src="susan5.png"className='w-[90px] h-[90px] bg-gray-300 rounded-full'/>
                    </div>

                </div>

                <div className='flex flex-col gap-[35px]'>

                    <TextField className="h-[48px] rounded-[15px]"label="Preffered Name"/>
                    <TextField className="h-[48px] rounded-[15px]"label="Email"/>
                    <TextField className="h-[48px] rounded-[15px]"label="Password"/>
                    <TextField className="h-[48px] rounded-[15px]"label="Birthday"/>
                    <div className='flex gap-[20px] '>
                        <TextField className="h-[48px] rounded-[15px]"label="Major"/>
                        <TextField className="h-[48px] rounded-[15px]"label="Year"/>

                    </div>
                    
                    <TextField className="h-[48px] rounded-[15px]" rows={2} label="Bio"/>
                <button className='bg-[#6FB0B6] text-white w-[67px] h-[36px] rounded-[4px]'>SAVE</button>
                </div>


            </div>

            


            <Footer/>


        </div>
    )
}