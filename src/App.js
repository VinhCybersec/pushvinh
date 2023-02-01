import React, { memo, useMemo, useEffect, useLayoutEffect } from "react";
import BottomPlay from "./layout/Bottom/BottomPlay";
import Header from "./layout/Header";
import Siderleft from "./layout/Siderleft";
import RouterPage from "./router/RouterPage";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPlaying } from "./features/SettingPlay/settingPlay";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./asset/firebase/firebase-config";
import { setUser } from "./features/User/userFeatures";
import "react-toastify/dist/ReactToastify.css";

function App() {
   const theme = useSelector((state) => state.themetoggle);
   const queueNowPlaySelector = useSelector((state) => state.queueNowPlay);
   const loggedSelector = useSelector((state) => state.logged);
   const settingSelector = useSelector((state) => state.setting);
   const lyricsSelector = useSelector((state) => state.lyrics);
   const timeSelector = useSelector((state) => state.currentTimes);
   const usersSelcetor = useSelector((state) => state.users);
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if(!usersSelcetor.activeUser && user) {
            dispatch(setUser({
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
              uid: user.uid,
            }));
         };
      });
     // eslint-disable-next-line
   }, []);

   useEffect(() => {
      const keyboardShortcuts = (e) => {
         let isInput = false;
         document.querySelectorAll("input").forEach((e) => {
            if (e === document.activeElement) {
               isInput = true;
            };
         });
         if (isInput) return;
         // eslint-disable-next-line default-case
         switch (e.keyCode) {
            case 32:
               e.preventDefault()
               dispatch(setPlaying())
               break
            case 39:
               document.querySelector("#nextMusic").click()
               break
            case 37:
               document.querySelector("#prevMusic").click()
               break
            case 74:
               document.querySelector("#randomMusic").click()
               break
            case 76:
               document.querySelector("#loopMusic").click()
               break
         }
      }
      document.addEventListener("keydown", keyboardShortcuts)
      return () => document.removeEventListener("keydown", keyboardShortcuts)
      // eslint-disable-next-line
   }, [])
   
   useMemo(() => {
      document.documentElement.setAttribute("data-theme", theme.dataTheme);
      if (theme.bgImg) {
         document.documentElement.classList.add("theme-bg-image");
      } else {
         document.documentElement.classList.remove("theme-bg-image");
      };
      if (theme.bgPlaying) {
         document.documentElement.classList.add("zma");
      } else {
         document.documentElement.classList.remove("zma");
      };
      if (theme.dataStyle) {
         const param = theme.dataStyle.map((e) => {
            return e;
         });
         document.documentElement.setAttribute("style", param.join(" ; "))
      } else {
         document.documentElement.removeAttribute("style")
      };
     // eslint-disable-next-line
   }, []);
   // set localStorage
   useMemo(() => {
      if(!JSON.parse(localStorage.getItem("queue_nowplay"))) {
         localStorage.setItem("queue_nowplay", JSON.stringify(queueNowPlaySelector));
      };
      if(!JSON.parse(localStorage.getItem("blackcat_logged"))) {
         localStorage.setItem("blackcat_logged", JSON.stringify(loggedSelector));
      };
      if(!JSON.parse(localStorage.getItem("blackcat_setting"))) {
         localStorage.setItem("blackcat_setting", JSON.stringify(settingSelector));
      };
      if(!JSON.parse(localStorage.getItem("blackcat_lyrics"))) {
         localStorage.setItem("blackcat_lyrics", JSON.stringify(lyricsSelector));
      };
      if(!JSON.parse(localStorage.getItem("blackcat_timeCurrent"))) {
         localStorage.setItem("blackcat_timeCurrent", JSON.stringify(timeSelector));
      };
     // eslint-disable-next-line
   }, []);
   
   useEffect(() => {
      window.addEventListener("load", () => {
         document.querySelector(".loadings")?.remove();
      });
   }, []);

   return (
      <>
         <div className="loadings">
            <div className="loader">
               <div className="bar1"/>
               <div className="bar2"/>
               <div className="bar3"/>
               <div className="bar4"/>
               <div className="bar5"/>
               <div className="bar6"/>
            </div>
         </div>

         <div className={`main ${queueNowPlaySelector.currentEncodeId ? "" : "hide-bottom"}`} style={theme.bgImg ? { backgroundImage: `url('${theme.bgImg}')` } : {}}>
            <Header/>
            <Siderleft/>
            <BottomPlay/>
            <RouterPage/>
            <ToastContainer
               position="top-center"
               autoClose={3000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               limit={5}
            />
         </div>
      </>
   );
};

export default memo(App);