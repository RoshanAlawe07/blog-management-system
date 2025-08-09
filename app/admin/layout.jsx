import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

export default function Layout({ children }) {
    return (
        <>
            <div className="flex">
                <ToastContainer theme="dark"/>
                <Sidebar />
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                                ← Back to Blog
                            </Link>
                            <h3 className="font-medium">Admin Panel</h3>
                        </div>
                        <Image src={assets.profile_icon} width={40} height={40} alt="" />
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}