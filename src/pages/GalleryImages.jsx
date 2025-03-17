// import React, { useEffect, useState } from "react";
// import { gapi } from "gapi-script";
// import { useParams } from "react-router-dom";
// import Loader from "../components/loaders/Loader";
// import useFetchDataById from "../hooks/useFetchDataById";
// import { Icon } from "@iconify/react";


// const GalleryImages = ({ languageText, language, api }) => {
//     const { id } = useParams();
//     const [images, setImages] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     const { data: galleryData, loading, error } = useFetchDataById(`${api}/api/gallery/${id}`);


//     useEffect(() => {
//         if (!galleryData?.driveLink) return;

//         function start() {
//             gapi.client
//                 .init({
//                     apiKey: import.meta.env.VITE_APP_API_CLOUD_KEY,
//                     clientId: import.meta.env.VITE_CLIENT_ID,
//                     scope: import.meta.env.VITE_APP_SCOPES,
//                     discoveryDocs: [
//                         "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
//                     ],
//                 })
//                 .then(() => {
//                     listImagesInFolder(galleryData.driveLink);
//                 });
//         }

//         gapi.load("client:auth2", start);
//     }, [galleryData?.driveLink]);

//     const listImagesInFolder = async (folderId, imagesArray = []) => {
//         try {
//             setIsLoading(true);

//             const response = await gapi.client.drive.files.list({
//                 // q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType = 'application/vnd.google-apps.folder')`,
//                 // q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'raw' or mimeType contains 'nef' or mimeType contains 'cr2' or mimeType contains 'tiff' or mimeType contains 'dng' or mimeType contains 'heic' or mimeType = 'application/vnd.google-apps.folder')`,
//                 q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType = 'image/jpeg' or mimeType = 'image/JPEG' or mimeType = 'image/png' or mimeType = 'image/jpg' or mimeType = 'image/webp' or mimeType = 'image/gif' or mimeType = 'image/bmp' or mimeType = 'image/tiff' or mimeType = 'image/heic' or mimeType = 'image/svg+xml' or mimeType = 'image/x-icon' or mimeType = 'application/vnd.google-apps.folder')`,



//                 pageSize: 100,
//                 fields: "files(id, name, mimeType)",
//             });

//             const files = response.result.files || [];

//             for (const file of files) {
//                 if (file.mimeType.includes("image/")) {
//                     imagesArray.push(file);
//                 } else if (file.mimeType === "application/vnd.google-apps.folder") {
//                     await listImagesInFolder(file.id, imagesArray);
//                 }
//             }

//             setImages([...imagesArray]);
//         } catch (error) {
//             console.error("Error fetching images:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const downloadImage = (imageId, imageName) => {
//         const link = document.createElement("a");
//         link.href = `https://drive.google.com/uc?export=download&id=${imageId}`;
//         link.download = imageName;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="min-h-screen flex flex-col justify-center p-6">
//             {(isLoading || loading) ? (
//                 <Loader text={languageText.Loading} />
//             ) : (
//                 <div className="flex flex-col justify-center">

//                     <h1 className="formTitle !text-7xl lg:!text-6xl  flex gap-4 !text-center !mt-20">{language === "en" ? galleryData.folderName : galleryData.arabicFolderName}</h1>



//                     {/* Masonry Layout */}
//                     {!isLoading && images.length > 0 && (
//                         <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
//                             {images.map((file) => (
//                                 <div key={file.id} className="relative break-inside-avoid rounded-lg shadow-md hover:scale-105 transition duration-500 ease-in-out">
//                                     {/* Image */}
//                                     <img
//                                         src={`https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`}
//                                         alt={file.name}
//                                         className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
//                                     />

//                                     {/* Overlay for Download Button */}
//                                     <div className="absolute hidden inset-0 bg-darktheme/80 bg-opacity-50 opacity-0 hover:opacity-100 lg:flex rounded-xl items-center justify-center transition-opacity duration-300 cursor-pointer">
//                                         <button
//                                             onClick={() => downloadImage(file.id, file.name)}
//                                             className="bg-redtheme text-whitetheme p-2 rounded-xl shadow-md hover:bg-redtheme2 hover:scale-130 transition duration-300 cursor-pointer flex items-center gap-3"
//                                         >
//                                             <Icon icon="mingcute:download-3-fill" />{languageText.Download}
//                                         </button>
//                                     </div>
//                                     <div className="absolute lg:hidden inset-0 flex rounded-xl items-start justify-end transition-opacity duration-300 cursor-pointer p-2">
//                                         <button
//                                             onClick={() => downloadImage(file.id, file.name)}
//                                             className="bg-redtheme text-whitetheme p-2 rounded-xl shadow-md hover:bg-redtheme2 hover:scale-130 transition duration-300 cursor-pointer flex items-center gap-3 text-[8px]"
//                                         >
//                                             <Icon icon="mingcute:download-3-fill" />{languageText.Download}
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                 </div>)}
//             {/* No Images Found */}
//             {!isLoading && images.length === 0 && (
//                 <p className="text-center text-gray-500">No images found in this folder.</p>
//             )}
//         </div>
//     );
// };

// export default GalleryImages;



import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { useParams } from "react-router-dom";
import Loader from "../components/loaders/Loader";
import useFetchDataById from "../hooks/useFetchDataById";
import { Icon } from "@iconify/react";
import ScrollToTop from "../components/ScrollToTop";

const GalleryImages = ({ languageText, language, api }) => {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // 'all', 'portrait', 'landscape'
    const [activeTab, setActiveTab] = useState("images"); // 'images' or 'videos'

    const { data: galleryData, loading, error } = useFetchDataById(`${api}/api/gallery/${id}`);

    useEffect(() => {
        if (!galleryData?.driveLink) return;

        function start() {
            gapi.client
                .init({
                    apiKey: import.meta.env.VITE_APP_API_CLOUD_KEY,
                    clientId: import.meta.env.VITE_CLIENT_ID,
                    scope: import.meta.env.VITE_APP_SCOPES,
                    discoveryDocs: [
                        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
                    ],
                })
                .then(() => {
                    listFilesInFolder(galleryData.driveLink);
                });
        }

        gapi.load("client:auth2", start);
    }, [galleryData?.driveLink]);

    const listFilesInFolder = async (folderId, imagesArray = [], videosArray = []) => {
        try {
            setIsLoading(true);
            const response = await gapi.client.drive.files.list({
                // q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.folder')`,
                q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType = 'image/jpeg' or mimeType = 'image/JPEG' or mimeType = 'image/png' or mimeType = 'image/jpg' or mimeType = 'image/webp' or mimeType = 'image/gif' or mimeType = 'image/bmp' or mimeType = 'image/tiff' or mimeType = 'image/heic' or mimeType = 'image/svg+xml' or mimeType = 'image/x-icon' or mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.folder')`,
                pageSize: 100,
                // fields: "files(id, name, mimeType)",
                fields: "files(id, name, mimeType, thumbnailLink)",
            });

            const files = response.result.files || [];

            for (const file of files) {
                if (file.mimeType.includes("image/")) {
                    try {
                        const metadataResponse = await gapi.client.drive.files.get({
                            fileId: file.id,
                            fields: "id, name, mimeType, imageMediaMetadata(width, height)"
                        });

                        const metadata = metadataResponse.result;
                        if (metadata.imageMediaMetadata) {
                            file.width = metadata.imageMediaMetadata.width;
                            file.height = metadata.imageMediaMetadata.height;
                        }
                    } catch (err) {
                        console.error("Error fetching metadata for image:", file.name, err);
                    }

                    imagesArray.push(file);
                } else if (file.mimeType.includes("video/")) {
                    videosArray.push(file);
                } else if (file.mimeType === "application/vnd.google-apps.folder") {
                    await listFilesInFolder(file.id, imagesArray, videosArray);
                }
            }

            setImages([...imagesArray]);
            setVideos([...videosArray]);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadFile = (fileId, fileName) => {
        const link = document.createElement("a");
        link.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredImages = images.filter((img) => {
        if (filter === "portrait" && img.width && img.height) return img.width < img.height;
        if (filter === "landscape" && img.width && img.height) return img.width > img.height;
        return true;
    });


    useEffect(() => {
        document.title = galleryData?.folderName + " | " + languageText.ISSEgyptGateway; // Change title when page loads
    }, []);
    return (
        <div className="min-h-screen flex flex-col justify-center p-6">
            {(isLoading || loading) ? (
                <Loader text={languageText.Loading} />
            ) : (
                <div className="flex flex-col justify-center">
                    <h1 className="formTitle !text-7xl lg:!text-6xl text-center mt-20">
                        {language === "en" ? galleryData.folderName : galleryData.arabicFolderName}
                    </h1>

                    {/* Tab Switcher */}
                    <div className="flex gap-4 justify-center mt-4">
                        <button
                            onClick={() => setActiveTab("images")}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${activeTab === "images" ? "bg-redtheme text-white" : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {languageText.Images}
                        </button>
                        <button
                            onClick={() => setActiveTab("videos")}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${activeTab === "videos" ? "bg-redtheme text-white" : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {languageText.Videos}

                        </button>
                    </div>

                    {/* Image Filters */}
                    {activeTab === "images" && (
                        <div className="flex gap-4 justify-center my-4">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${filter === "all" ? "bg-redtheme text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {languageText.All}
                            </button>
                            <button
                                onClick={() => setFilter("portrait")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${filter === "portrait" ? "bg-redtheme text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {languageText.Portrait}

                            </button>
                            <button
                                onClick={() => setFilter("landscape")}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${filter === "landscape" ? "bg-redtheme text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {languageText.Landscape}
                            </button>
                        </div>
                    )}

                    {/* Images Section */}
                    {activeTab === "images" && !isLoading && filteredImages.length > 0 && (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {filteredImages.map((file) => (
                                <div key={file.id} className="relative break-inside-avoid rounded-lg shadow-md hover:scale-105 transition duration-500 ease-in-out">
                                    <img
                                        src={`https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`}
                                        alt={file.name}
                                        className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute hidden inset-0 bg-darktheme/80 bg-opacity-50 opacity-0 hover:opacity-100 lg:flex rounded-xl items-center justify-center transition-opacity duration-300 cursor-pointer">
                                        <button
                                            onClick={() => downloadFile(file.id, file.name)}
                                            className="bg-redtheme text-whitetheme p-2 rounded-xl shadow-md hover:bg-redtheme2 hover:scale-130 transition duration-300 cursor-pointer flex items-center gap-3"
                                        >
                                            <Icon icon="mingcute:download-3-fill" />{languageText.Download}
                                        </button>
                                    </div>
                                    <div className="absolute lg:hidden inset-0 flex rounded-xl items-start justify-end transition-opacity duration-300 cursor-pointer p-2">
                                        <button
                                            onClick={() => downloadFile(file.id, file.name)}
                                            className="bg-redtheme text-whitetheme p-2 rounded-xl shadow-md hover:bg-redtheme2 hover:scale-130 transition duration-300 cursor-pointer flex items-center gap-3 text-[8px]"
                                        >
                                            <Icon icon="mingcute:download-3-fill" />{languageText.Download}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Videos Section */}
                    {activeTab === "videos" && !isLoading && videos.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {videos.map((file) => (
                                <div key={file.id} className="relative rounded-lg shadow-md">
                                    <iframe
                                        src={`https://drive.google.com/file/d/${file.id}/preview`}
                                        width="100%"
                                        height="300"
                                        // allow="autoplay"
                                        className="rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && activeTab === "videos" && videos.length === 0 && (
                        <p className="text-center text-gray-500">{languageText.NoVideosFound}</p>
                    )}
                </div>
            )}
            <ScrollToTop languageText={languageText} />

        </div>
    );
};

export default GalleryImages;
