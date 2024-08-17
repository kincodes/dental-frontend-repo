import axios from '../api/axios';
import useAuth from './useAuth';

import {useState } from "react";


const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const [jwt, setJwt] = useState(() => {
        const saved = localStorage.getItem("jwt");
        const initialValue = JSON.parse(saved);
        return initialValue || "";
      });

    const refresh = async () => {
        const response = await axios.post('/refresh-token', {},
         {
          
            headers: {
                 Authorization: `Bearer ${jwt}`,
                 "Content-Type": "application/json"
         },    
        });
        setAuth(prev => {
           // console.log(JSON.stringify(prev?.accessToken) + "previous");
            //console.log((response?.data?.token) + "new");
            return { ...prev, roles: response?.data?.role, accessToken: response?.data?.token }
        });

         try{
            localStorage.setItem("jwt", JSON.stringify(response?.data?.token));
           }catch(err){
               console.log(err);
           } 

        return response?.data?.token;
    }
    return refresh;
};

export default useRefreshToken;