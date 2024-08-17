import { axiosRefresh } from "../api/axios";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthProvider";
import Refresh from "../components/pages/Refresh";

import useAuth from "./useAuth";

const useAxiosRefresh = () => {
    
   

    const { auth } = useAuth();
    //const refresh = Refresh();

    useEffect(() => {

        const requestIntercept = axiosRefresh.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                    //console.log("Testing token....", JSON.stringify(auth?.accessToken));
                }
                return config;
            }, (error) => Promise.reject(error)
        );
      /*   const responseIntercept = axiosRefresh.interceptors.response.use(
            response => response,

        
            async (error) => {

                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();

                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                     return axiosRefresh(prevRequest);
                }
            return Promise.reject(error);
            
          }); */
/* 
        const responseIntercept = axiosRefresh.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosRefresh(prevRequest);
                }
                return Promise.reject(error);
            }
        );
 */
        return () => {
            axiosRefresh.interceptors.request.eject(requestIntercept);
          //  axiosRefresh.interceptors.response.eject(responseIntercept);
        }
    }, [auth])

    return axiosRefresh;
}

export default  useAxiosRefresh ;