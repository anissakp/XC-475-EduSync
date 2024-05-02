import TextField from '@mui/material/TextField';
import Footer from '../components/Footer';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import { getAuth} from "firebase/auth";
import { collection, getDocs, getDoc } from "firebase/firestore";

export default function EditProfile() {
    const [selectedImage, setSelectedImage] = useState('profile pic.svg');
    const [isSaved, setIsSaved] = useState(false);
    const [disabledFields, setDisabledFields] = useState(false);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const handleSave = () => {
        setIsSaved(true);
        setDisabledFields(true);
    };

    const handleEdit = () => {
        setIsSaved(false);
        setDisabledFields(false);
    };

    

    return (
        <div className='flex flex-col '>
            <div className="flex justify-between h-[100px] items-center">
                <img className='w-[238px] ml-10' src="mainLogo2.png" />
                <button onClick={goToDashboard} className="bg-black text-white  mr-10">{"< Dashboard"}</button>
            </div>

            <div className='flex ml-auto mr-auto gap-[101px] mt-[70px]'>
                <div className='w-[352px]' >
                    <img src={selectedImage} className='w-[322px] h-[322px] bg-gray-300 rounded-full'></img>
                    <div className='grid grid-cols-3 gap-[20px] mt-[20px]'>
                        <img onClick={() => handleImageClick('profile pic.svg')} src="profile pic.svg" className='w-[90px] h-[90px] bg-gray-300 rounded-full hover:cursor-pointer' />
                        <img onClick={() => handleImageClick('Emily.png')} src="Emily.png" className='w-[90px] h-[90px] bg-gray-300 rounded-full hover:cursor-pointer' />
                        <img onClick={() => handleImageClick('Samantha.png')} src="Samantha.png" className='w-[90px] h-[90px] bg-gray-300 rounded-full hover:cursor-pointer' />
                        <img onClick={() => handleImageClick('Shaimaa.png')} src="Shaimaa.png" className='w-[90px] h-[90px] bg-gray-300 rounded-full hover:cursor-pointer' />
                        <img onClick={() => handleImageClick('Anissa.png')} src="Anissa.png" className='w-[90px] h-[90px] bg-gray-300 rounded-full hover:cursor-pointer' />
                        <img onClick={() => handleImageClick('Zai.png')} src="Zai.png" className='w-[90px] h-[90px] bg-gray-300 rounded-full hover:cursor-pointer' />
                    </div>
                </div>

                <div className='flex flex-col gap-[35px]'>
                    <TextField className="h-[48px] rounded-[15px]" label="Preferred Name" disabled={isSaved || disabledFields} />
                    <TextField className="h-[48px] rounded-[15px]" label="Email" disabled={isSaved || disabledFields} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField label="Birthday" disabled={isSaved || disabledFields} />
                    </LocalizationProvider>

                    <div className='flex gap-[20px] '>
                        <TextField className="h-[48px] rounded-[15px]" label="Major" disabled={isSaved || disabledFields} />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label={'Graduation Year'} views={['year']} disabled={isSaved || disabledFields} />
                        </LocalizationProvider>
                    </div>

                    <TextField className="h-[48px] rounded-[15px]" rows={2} label="Bio" disabled={isSaved || disabledFields} />
                    {isSaved ? (
                        <button className='bg-[#6FB0B6] text-white w-[67px] h-[36px] rounded-[4px]' onClick={handleEdit}>Edit</button>
                    ) : (
                        <button className='bg-[#6FB0B6] text-white w-[67px] h-[36px] rounded-[4px]' onClick={handleSave}>SAVE</button>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
