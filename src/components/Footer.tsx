
import edusyncLogo from "../assets/edusyncLogo.png"
export default function Footer() {
    return (

        <footer className="bg-gradient-to-r from-customStart to-customEnd shadow dark:bg-gray-900 mt-32">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={edusyncLogo} className="h-8" alt="EduSync Logo" />
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-black-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">About</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-black-500 sm:text-center dark:text-black-400">© 2024 <a href="https://flowbite.com/" className="hover:underline">EduSync™</a>. All Rights Reserved.</span>
            </div>
        </footer>


    )
}