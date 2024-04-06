import TextField from '@mui/material/TextField';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate() 

    const goToDashboard = () => {
        navigate('/dashboard')
    }

    const goToEditProfile = () => {
        navigate('/editProfile')
    }
    return (
        <div className='flex flex-col gap-[33px]'>
            <div className="h-[90px] w-full flex justify-between items-center px-8">
                <img className="w-[238px] mt-auto  h-[83px]"src="mainLogo2.png"></img>
                <button onClick={goToDashboard}className='bg-black text-white'>{"< Dashboard"}</button>

            </div>
            <div className='relative'>
                <div className="h-[161px] bg-gradient-to-r from-[#F7E2B3] to-[#6FB0B6]"></div>
                <div className='flex w-[1232px] ml-auto mr-auto justify-between'> 
                    <div className='flex'>
                        
                        <img  src="ShaimaaSabbagh.png" className='bg-[#EBEDEC] w-[216px] h-[216px] rounded-full  border-solid absolute top-16 border-[#EBEDEC] border-[10px] m-0 p-0'/>
                       
                        <div className='ml-60 mt-4'>
                            <p className='text-[34px]'>Shaimaa Sabbagh</p>
                            <p>Computer Science - Senior</p>
                            <p className='font-extrabold'>SHARED NOTES: 133 LIKES: 500 FRIENDS: 12</p>
                        </div>

                    </div>
                    
                    <button onClick={goToEditProfile} className='bg-[#6FB0B6] text-white mt-6'>EDIT/VIEW INFORMATION</button>
                </div>
            </div>
            
            <div className='ml-auto mr-auto mt-10'>
                <TextField rows={2} multiline className='w-[1232px]  bg-[#D9D9D9]' label="Description"/>
            </div>
            <div className='flex ml-auto mr-auto gap-[30px]'>
                <div className='w-[909px] h-[494px] rounded-t-[20px] bg-white'>
                    <div className=' flex rounded-t-[20px] h-[76px] bg-[#A2D9D1] pl-4 pt-4  justify-between'>
                        <p>Public notes</p>
                        <div className='flex'>
                            
                        </div>
                        
                    </div>
                    
                    
                </div>
                <div className=' rounded-[20px] w-[293px] h-[494px] bg-gradient-to-b from-[#F2E1B4] to-[#E6A586]'>
                    <p className='bg-[#E1AB91] h-[76px] pl-4 pt-4 rounded-t-[20px]'>Current courses</p>
                
                    
                </div>
            </div>
            <div className='flex gap-[31px] ml-auto mr-auto'>
                <div className='w-[391px] flex flex-col gap-[20px]'>
                    <p className='bg-gradient-to-t from-[#6FB0B6] to-[#A2D9D1] h-[183px] rounded-[15px] pl-4 pt-4'>Tasks done</p>
                    <p className='bg-gradient-to-b from-[#DFA48A] to-[#D47D63] h-[183px] rounded-[15px] pl-4 pt-4'>Tasks in progress</p>
                </div>
                <div className='w-[391px] h-[387px] bg-white rounded-[15px]'>
                    <p className='bg-[#6FB0B6] h-[76px] rounded-t-[15px] flex items-center pl-4 '>SAVED NOTES</p>
                    <div className=''></div>
                </div>
                <div className='w-[391px] h-[387px] bg-white rounded-[15px]'>
                    <p className='bg-[#DE8C73] h-[76px] rounded-t-[15px] flex items-center pl-4'>PRIVATE NOTES</p>
                    <div className=''></div>
                </div>
            </div>

            <Footer/>

        </div>
    )
}