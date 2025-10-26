import { SCHOOL_ADDRESS, SCHOOL_EMAIL, SCHOOL_MOTTO, SCHOOL_NAME, SCHOOL_PHONE } from "@/components/constant";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return ( 
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-graduation-cap-line text-white"></i>
              </div>
              <span className="text-xl font-semibold">{SCHOOL_NAME}</span>
            </div>
            <p className="text-gray-400">{SCHOOL_MOTTO}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-5">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <p>{SCHOOL_ADDRESS}</p>
              <p>{SCHOOL_PHONE}</p>
              <p>{SCHOOL_EMAIL}</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-5">Quick Links</h4>
            <div className="space-y-2 text-gray-400">
              <NavLink to='/' className='hover:text-white text-gray-400 cursor-pointer'>Student Portal</NavLink>
               <NavLink to='/' className='hover:text-white text-gray-400 cursor-pointer'>Admin Portal</NavLink>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-4 pt-2  text-gray-400 flex justify-between">
          <p>@{year} {SCHOOL_NAME}</p>
          <p><a href="https://mrnia.vercel.app" className="text-blue-200 hover:text-blue-300"></a>Code by Christopher Nia</p>
        </div>
      </div>
    </footer>
  );
}
 
export default Footer;