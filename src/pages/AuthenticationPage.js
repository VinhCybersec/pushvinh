/*================== npm package ==========================*/
import { /*onAuthStateChanged,*/ signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import React, { useState, memo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import { auth, database } from "../asset/firebase/firebase-config";
import { setUser } from "../features/User/userFeatures";
/*========================================================*/
const SignUpStyles = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   width: 100vw;
   height: 100vh;
   background-color: var(--layout-bg);
   z-index: 8888;
   transition: all 0.3s;
   overflow-y: auto;
   .sider {
      margin-bottom: 2rem;
      .sider_brand-item {
         font-size: 4rem;
         display: flex;
         align-items: center;
         justify-content: center;
         font-family: "Patrick Hand SC", cursive;
         transition: 0.2s ease-in;
         p {
            font-size: 4rem;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            font-family: "Patrick Hand SC", cursive;
            transition: 0.2s ease-in;
         }
         &:hover {
            opacity: 0.8;
            cursor: pointer;
         }
         span {
            font-size: 3rem;
            margin-left: 6px;
            font-family: "Patrick Hand SC", cursive;
         }
         .sider_brand-item-img {
            display: flex;
            align-items: center;
            justify-content: center;
            img {
               max-height: 42px;
               filter: grayscale(100%);
               margin-right: 10px;
            }
         }
      }
   }
   .authForm {
      position: relative;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      align-items: stretch;
      -webkit-box-shadow: 0px 2px 6px 0px #1d2030;
      box-shadow: 0px 2px 6px 0px #1d2030;
      .left {
         background-color: rgb(12 14 33 / 92%);
         color: #ffffff;
         border-top-left-radius: 4px;
         border-bottom-left-radius: 4px;
         padding-top: 30px;
         padding-bottom: 40px;
         padding-right: 30px;
         padding-left: 30px;
      }

      .right {
         padding-top: 30px;
         padding-bottom: 40px;
         padding-right: 30px;
         padding-left: 30px;
         background-color: #ffffff;
         border-top-right-radius: 4px;
         border-bottom-right-radius: 4px;
         color: #2d385e;
         .text-header {
            font-size: 20px;
            font-weight: 500;

            &.active {
               font-size: 30px;
               font-weight: 700;
            }
         }
      }

      .btnAuth {
         padding: 8px 8px;
         width: 100%;
         border: 1px solid transparent;
         border-radius: 4px;
         transition: all 0.2s;
         &:hover {
            opacity: 0.8;
         }
      }
   }
   .form-control {
      background-color: #fff;
      width: 100%;
      color: #333333;
      font-size: 18px;
      height: 50px;
      margin-top: 16px;
      padding: 12px 22px;
      border-radius: 4px;
      border: solid 1px #bcc2ce;
      outline: none;
      -webkit-box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 10%), 0 0 2px 0 rgba(0, 0, 0, 10%);
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 10%), 0 0 2px 0 rgba(0, 0, 0, 10%);
   }
   .btn-login {
      color: white;
      width: 100%;
      padding: 12px;
      margin-top: 2rem;
      font-size: 16px;
      font-weight: 500;
      border-radius: 4px;
      background-color: #486ff2;
      border-color: #486ff2;
      box-shadow: 0px 2px 3px #9c9c9c;

      &:hover {
         opacity: 0.8;
         cursor: pointer;
      }
   }
   @media (max-width: 719px) {
      .left,
      .right {
         padding-top: 2rem !important;
         padding-bottom: 2rem !important;
      }

      .left {
         flex-direction: column !important;
      }
      .sider {
         margin-bottom: 1rem;
      }
   }
`
/*========================================================
# Bi???u m???u ????ng nh???p
========================================================*/
const SignInForm = memo(({ setSign }) => {
   const schema = yup.object({
     email: yup.string().required("Vui l??ng nh???p tr?????ng n??y").max(40).email(),
     password: yup.string().required("Vui l??ng nh???p tr?????ng n??y").max(30).min(7, "????? d??i t???i thi???u 7 k?? t???"),
   });
   const { register, handleSubmit, reset, formState: { errors }, setFocus } = useForm({ resolver: yupResolver(schema), mode: "onChange" })
   const navigate = useNavigate()
   const dispatch = useDispatch()
   useEffect(() => {
      setFocus("email")
   }, [setFocus])

   // useEffect(() => {
   //    onAuthStateChanged(auth, (user) => {
   //       console.log(user)
   //    })
   // }, [])

   const onSubmitLogin = (data) => {
      signInWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
        setTimeout(() => reset({ email: "", password: "" }), 1000);
        // 
        dispatch(setUser({
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        }));
        // 
        toast("????ng Nh???p Th??nh C??ng", {
          type: "success",
        });
        // 
        setTimeout(() => navigate("/"), 700);
      }).catch((error) => {
        console.log(error);
        // 
        toast("????ng Nh???p kh??ng th??nh c??ng, T??i Kho???n ho???c M???t Kh???u kh??ng ch??nh x??c ????", {
          type: "error",
        });
        // 
        setTimeout(() => reset({ password: "" }), 1000);
      });
   };

   return (
      <div>
         <form onSubmit={handleSubmit(onSubmitLogin)} name="loginForm" className="loginForm w-full">
            {/* T??i Kho???n */}
            <div className="form-group">
               <input {...register("email")} type="email" className="form-control email" name="email" placeholder="Email " />
            </div>
            <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.email?.message}</div>
           {/* M???t Kh???u */}
            <div className="form-group">
               <input {...register("password")} type="password" className="form-control password" name="password" placeholder="Password" />
               <span className="fa fa-eye-slash pwd-toggle" />
            </div>
            <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.password?.message}</div>
            <button className="btn-login " type="submit">
               ????ng Nh???p
            </button>
         </form>
         <div className="flex items-center justify-between mt-[20px]">
            <div>B???n ch??a c?? t??i kho???n?</div>
            <button onClick={() => setSign(false)} className="underline text-blue-600">
              ????ng k??{" "}
            </button>
         </div>
      </div>
   );
});
/*========================================================
# Bi???u m???u ????ng k??
========================================================*/
const SignUpForm = ({ setSign }) => {
   const schema = yup.object({
     email: yup.string().required("Vui l??ng nh???p v??o ?? n??y").max(40).email(),
     password: yup.string().required("Vui l??ng nh???p v??o ?? n??y").max(30).min(7, "????? d??i t???i thi???u 7 k?? t???"),
     passwordCheck: yup.string().required("Vui l??ng nh???p v??o ?? n??y").oneOf([yup.ref("password"), null], "Kh??ng kh???p v???i m???t kh???u"),
     name: yup.string().required("Vui l??ng nh???p v??o ?? n??y").max(30).min(5),
   });
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setFocus } = useForm({
     resolver: yupResolver(schema),
     mode: "onChange",
   });
   const onSubmit = async(data) => {
      createUserWithEmailAndPassword(auth, data.email, data.password).then(async(userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: data.name,
        });
        await setDoc(doc(database, "users", userCredential.user.uid), {
          email: data.email,
          password: data.password,
          name: data.name,
          id: userCredential.user.uid,
          favouriteSongs: [],
          favouritePlaylist: [],
          favouriteArtist: [],
          timestamp: serverTimestamp(),
        });
        dispatch(setUser({
          displayName: data.name,
          photoURL: userCredential.user.photoURL,
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        }));
        setTimeout(() => {
          reset({ email: "", password: "", passwordCheck: "", name: "" });
        }, 1000);
        toast("????ng k?? Th??nh C??ng ", {
          type: "success",
        });
        setTimeout(() => navigate("/"), 1000);
      }).catch((error) => {
        console.log(error);
        return toast("????ng k?? Kh??ng Th??nh C??ng ", {
          type: "error",
        });
      });
   };
   useEffect(() => {
      setFocus("email");
   }, [setFocus]);

   return (
      <div>
         <form onSubmit={handleSubmit(onSubmit)} name="loginForm" className="loginForm w-full">
            <div className="form-group">
               <input {...register("email")} type="email" className="form-control email" name="email" placeholder="Email " />
            </div>
            <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.email?.message}</div>

            <div className="form-group">
               <input {...register("password")} type="password" className="form-control password" name="password" placeholder="M???t kh???u"/>
               <span className="fa fa-eye-slash pwd-toggle" />
            </div>
            <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.password?.message}</div>

            <div className="form-group">
               <input {...register("passwordCheck")} type="password" className="form-control password" name="passwordCheck" placeholder="Nh???p l???i m???t kh???u"/>
               <span className="fa fa-eye-slash pwd-toggle" />
            </div>
            <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.passwordCheck?.message}</div>

            <div className="form-group">
               <input {...register("name")} type="text" className="form-control " name="name" placeholder="T??n hi???n th???" />
               <span className="fa fa-eye-slash pwd-toggle" />
            </div>
            <div className="mt-[6px]  px-[1rem] text-red-500">{errors?.name?.message}</div>

            <button disabled={isSubmitting} className="btn-login " type="submit">
               {isSubmitting ? "Loading..." : "????ng K??"}
            </button>
         </form>
         <div className="flex items-center justify-between mt-[20px]">
            <div>B???n ???? c?? t??i kho???n?</div>
            <button onClick={() => setSign(true)} className="underline text-blue-600">
               ????ng Nh???p{" "}
            </button>
         </div>
      </div>
   );
};
/*========================================================
# AuthenticationPage
========================================================*/
const AuthenticationPage = () => {
   const [sign, setSign] = useState(true);
   return (
      <SignUpStyles>
         <div className="gird wide">
            <div className="flex w-full h-[100vh] items-center justify-center">
               <div className=" mb-[5rem] l-8 m-10 c-12">
                  <div className="row !flex-wrap authForm">
                     <div className="col l-5 m-5 c-12   left flex items-center justify-center ">
                        <div className="sider">
                           <div className="sider_brand-item">
                              <div className="sider_brand-item-img">
                                 <img src="/avatarMain.png" alt="logo" />
                              </div>
                              <p className="sider_brand-item-text">
                                 BlackCat - Club
                              </p>
                           </div>
                        </div>
                       {/*
                        <div className="text-center mb-[2rem]  font-semibold">????ng nh???p b???ng m???ng x?? h???i ????? truy c???p nhanh</div>
                        <div className="flex flex-col justify-start items-center gap-[16px]">
                           <button className="btnAuth bg-[#3b5998]">Ti???p t???c v???i Facebook</button>
                           <button className="btnAuth bg-[#c32f10] ">Ti???p t???c v???i Google</button>
                           <button className="btnAuth bg-[#2B3137]">Ti???p t???c v???i Github</button>
                        </div>
                        */}
                     </div>
                     <div className="col l-7 m-7 c-12 right">
                        <div className="flex  items-baseline justify-center ">
                           <div className="text-header active">{sign ? "????ng Nh???p" : "????ng K??"}</div>
                        </div>
                        {sign ? <SignInForm setSign={setSign}/> : <SignUpForm setSign={setSign}/>}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </SignUpStyles>
   );
};

export default AuthenticationPage;