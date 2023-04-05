import '../pages.css'
import './posts.css'
import Sidebar from "../../components/Sidebar/sidebar";
import ImageUpload from "../../components/ItemDisplay/image-upload";

export default function ImagePost() {
    return (
        <div className='Page'>
        <Sidebar/>
        <div className='Fragment sidebar-offset'>
          <ImageUpload/>
        </div>
      </div>
    
    );
};