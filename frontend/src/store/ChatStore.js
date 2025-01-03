import {create} from 'zustand'
import toast from 'react-hot-toast'
import {axiosInstance} from '../lib/axios.js'
import {useAuthStore} from './AuthStore.js'


export const useChatStore= create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    

    getUsers: async()=>{
        set({isUsersLoading:true})
        try {
            const res= await axiosInstance.get("/messages/users")
            set({users:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUsersLoading:false})
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
      },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          console.log("messagrData:",messageData);
          
          const formData = new FormData();
          formData.append('text', messageData.text);
          if (messageData.image) {
            formData.append('image', messageData.image);
        }
        // Log FormData
          for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("res data",res.data);
          
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

    deleteChat: async(receiverId)=>{
        try {
          await axiosInstance.delete(`/messages/delete/${receiverId}`)
          set({
            messages: []
          });
          toast.success('Chat deleted successfully');
        } catch (error) {
          toast.error('Failed to delete chat');
        }
      },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        socket.on("newMessage", (newMessage) => {
          console.log("Received new message:", newMessage);
          if(newMessage.senderId!==selectedUser._id) return;
          set({
            messages: [...get().messages, newMessage],
          });
        });
      },

    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
      socket.off("typing");
    },

    
    setSelectedUser: (selectedUser)=>set({selectedUser}),
   
}))