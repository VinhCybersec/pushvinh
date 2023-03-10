import React, { memo } from "react";
import HeaderRight from "../components/Navbar/HeaderRight";
import ItemLogin from "../components/Navbar/ItemLogin";
import NavForm from "../components/Navbar/NavForm";
import NavLinkArow from "../components/Navbar/NavLinkArow";

const Header = () => {
   return (
      <header className="header">
         <div className="header_content">
            <div className="header_content-btn-user-c">
               <ItemLogin isTitle={false}/>
            </div>
            <div className="header_content-left">
               <NavLinkArow/>
               <NavForm/>
            </div>
            <HeaderRight/>
         </div>
      </header>
   );
};

export default memo(Header);