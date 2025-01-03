import { Trash2, X } from "lucide-react";
import { useAuthStore } from "../store/AuthStore.js";
import { useChatStore } from "../store/ChatStore.js";
import { useEffect } from "react";

const ChatHeader =() => {
  const { selectedUser, setSelectedUser,deleteChat } = useChatStore();
  const { onlineUsers } = useAuthStore();

 
  
  const handleDeleteChat=()=>{
    if (selectedUser) {
      deleteChat(selectedUser._id);
    }
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Delete Chat Button */}
          <button onClick={handleDeleteChat} className="btn btn-danger">
            <Trash2 />
          </button>

          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;