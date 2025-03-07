import axios from "axios";

const uploadFile = async (type, file, preset) => {
    const data = new FormData();
    data.append("file", file);
    // data.append("upload_preset", preset);
    data.append("upload_preset", type === 'image' ? preset : '');


    try {
        let resourceType = type === "image" ? "image" : "video";
        let api = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

        const res = await axios.post(api, data);
        const { secure_url } = res.data;
        return secure_url;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

export default uploadFile;
