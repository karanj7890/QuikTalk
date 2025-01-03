import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE_URL= import.meta.env.MODE === "development" ?"http://localhost:5001" : "/"
export const useAuthStore= create((set,get)=>({
    authUser: null,
    isSignningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuth: async()=>{
        try {
            const res= await axiosInstance.get("/auth/check")

            set({authUser: res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth",error);
            
            set({authUser:null})
        } finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async(data)=>{
        set({isSignningUp: true})
        try {
            const res= await axiosInstance.post("/auth/signup",data)
            set({authUser: res.data})
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSignningUp:false})
        }
    },
    login: async(data)=>{
        set({isLoggingIn: true})
        try {
            const res= await axiosInstance.post("/auth/login",data)
            set({authUser: res.data})
            toast.success("You are now Signed in")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isLoggingIn:false})
        }
    },
    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged Out Successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    
    updateProfile: async(image)=>{
        set({isUpdatingProfile:true})
        try {
            const formData = new FormData();
            formData.append('image', image);

            const res= await axiosInstance.put("/auth/update-profile",formData);
            set({authUser: res.data})
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updateProfile",error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
                toast.error(error.response.data.message);
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error("No response from server");
            } else {
                console.error('Error setting up request:', error.message);
                toast.error(error.message);
            }
        } finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket: ()=>{
        const {authUser}= get()
        if(!authUser || get().socket?.connected) return;
        const socket= io(BASE_URL,{
            query:{
                userId: authUser._id
            }
        })
        socket.connect()

        set({socket: socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: ()=>{
        if(get().socket?.connected){
            get().socket.disconnect()
        }
    }
    
    
}))