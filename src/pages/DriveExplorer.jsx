import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { useParams } from "react-router-dom";
import Loader from "../components/loaders/Loader";
import { Icon } from "@iconify/react";
import ScrollToTop from "../components/ScrollToTop";


const DriveExplorer = ({ languageText, language }) => {
    const { id } = useParams(); // Get Drive folder ID from URL
    const [files, setFiles] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const [currentFolder, setCurrentFolder] = useState(id);
    const [rootFolder, setRootFolder] = useState(id); // Store the root folder ID
    const [folderStack, setFolderStack] = useState([id]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState({
        direct: [],
        indirect: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [allFilesAndFolders, setAllFilesAndFolders] = useState([]); // Store all accessible files and folders
    const [folderPaths, setFolderPaths] = useState({}); // Store paths to folders
    const [isCollectingData, setIsCollectingData] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        if (!currentFolder) return;
        gapi.load("client", initClient);
    }, []);

    useEffect(() => {
        if (!currentFolder) return;
        fetchFolderContents(currentFolder);
    }, [currentFolder]);

    const initClient = () => {
        gapi.client
            .init({
                apiKey: import.meta.env.VITE_APP_API_CLOUD_KEY,
                clientId: import.meta.env.VITE_CLIENT_ID,
                scope: "https://www.googleapis.com/auth/drive.readonly",
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            })
            .then(() => {
                setRootFolder(id); // Set root folder explicitly with initial ID
                fetchFolderContents(currentFolder);
                // Fetch all accessible files and folders for search
                setIsCollectingData(true);
                fetchAllAccessibleItems(id);
            })
            .catch(error => {
                console.error("Error initializing Google API client:", error);
                setIsLoading(false);
                setIsCollectingData(false);
            });
    };

    // Fetch all accessible files and folders recursively
    const fetchAllAccessibleItems = async (folderId, parentPath = '') => {
        try {
            // First get all files and folders in the current folder
            const response = await gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: "files(id, name, mimeType, webViewLink, parents)",
                pageSize: 1000,
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
            });

            const items = response.result.files.filter(file => file.name !== "desktop.ini");

            // Get current folder name for path construction
            let folderName = "";
            if (folderId === id) {
                folderName = "Root";
            } else {
                try {
                    const folderInfo = await gapi.client.drive.files.get({
                        fileId: folderId,
                        fields: "name"
                    });
                    folderName = folderInfo.result.name;
                } catch (error) {
                    console.error("Error getting folder name:", error);
                    folderName = "Unknown Folder";
                }
            }

            // Construct current path
            const currentPath = parentPath ? `${parentPath} > ${folderName}` : folderName;

            // Add paths to folder paths map
            const newPaths = { ...folderPaths };
            newPaths[folderId] = currentPath;

            // Add path info to each item
            const itemsWithPath = items.map(item => ({
                ...item,
                path: currentPath
            }));

            // Add these items to our collection
            setAllFilesAndFolders(prev => [...prev, ...itemsWithPath]);
            setFolderPaths(newPaths);

            // Recursively fetch subfolders (with depth limit to prevent excessive API calls)
            const folders = items.filter(item => item.mimeType.includes("folder"));

            for (const folder of folders) {
                // Avoid infinite recursion by checking path length
                if (currentPath.split(">").length < 10) {
                    await fetchAllAccessibleItems(folder.id, currentPath);
                }
            }
        } catch (error) {
            console.error("Error fetching all accessible items:", error);
        } finally {
            if (folderId === id) {
                setIsCollectingData(false);
            }
        }
    };

    // Fetch Folder Contents (including shared folders)
    const fetchFolderContents = async (folderId) => {
        try {
            setIsLoading(true);
            const response = await gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: "files(id, name, mimeType, webViewLink, shared)",
                pageSize: 100,
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
            });

            const filteredFiles = response.result.files.filter(file => file.name !== "desktop.ini");

            // Enhance files with path information
            const filesWithPaths = await Promise.all(filteredFiles.map(async (file) => {
                // Get path from previously collected data if available
                const knownItem = allFilesAndFolders.find(item => item.id === file.id);
                if (knownItem && knownItem.path) {
                    return { ...file, path: knownItem.path };
                }

                // If not available in collected data, use current folder path
                let currentFolderPath = folderPaths[folderId] || "";
                return { ...file, path: currentFolderPath };
            }));

            // Sort: Folders first, then files
            const sortedFiles = filesWithPaths.sort((a, b) => {
                if (a.mimeType.includes("folder") && !b.mimeType.includes("folder")) return -1;
                if (!a.mimeType.includes("folder") && b.mimeType.includes("folder")) return 1;
                return a.name.localeCompare(b.name);
            });

            setFiles(sortedFiles);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Open Folder
    const openFolder = (folderId) => {
        setSearchResults({ direct: [], indirect: [] }); // Clear search when navigating
        setIsSearching(false); // Exit search mode
        setFolderStack([...folderStack, folderId]);
        setCurrentFolder(folderId);
    };

    // Go Back
    const goBack = () => {
        if (folderStack.length > 1) {
            const newStack = [...folderStack];
            newStack.pop();
            setFolderStack(newStack);
            setCurrentFolder(newStack[newStack.length - 1]);
            setSearchResults({ direct: [], indirect: [] }); // Clear search when navigating
            setIsSearching(false); // Exit search mode
        }
    };

    // Go Home (to root folder)
    const goHome = () => {
        setFolderStack([rootFolder]);
        setCurrentFolder(rootFolder);
        setSearchResults({ direct: [], indirect: [] }); // Clear search
        setIsSearching(false); // Exit search mode
    };

    // Download folder as ZIP
    const downloadFolderAsZip = async (folderId, folderName) => {
        try {
            setIsDownloading(true);
            setDownloadProgress(0);

            // Notify user that we're preparing the download
            const downloadStatusElem = document.createElement('div');
            downloadStatusElem.style.position = 'fixed';
            downloadStatusElem.style.top = '20px';
            downloadStatusElem.style.left = '50%';
            downloadStatusElem.style.transform = 'translateX(-50%)';
            downloadStatusElem.style.backgroundColor = 'rgba(0,0,0,0.8)';
            downloadStatusElem.style.color = 'white';
            downloadStatusElem.style.padding = '10px 20px';
            downloadStatusElem.style.borderRadius = '5px';
            downloadStatusElem.style.zIndex = '1000';
            downloadStatusElem.innerText = 'Preparing folder for download...';
            document.body.appendChild(downloadStatusElem);

            // First, create a ZIP export request using Google Drive's export feature
            const response = await gapi.client.drive.files.export({
                fileId: folderId,
                mimeType: 'application/zip'
            }).catch(async () => {
                // If direct export fails, use the alternative method
                // This is a fallback since not all folders can be directly exported

                // Use Google Drive's create-zip endpoint
                const exportResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}/export?mimeType=application/zip`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${gapi.auth.getToken().access_token}`
                    }
                });

                if (!exportResponse.ok) {
                    throw new Error('Failed to create ZIP export');
                }

                return exportResponse;
            });

            // Check if we have a response (either from the first attempt or fallback)
            if (!response) {
                throw new Error('Failed to create ZIP export');
            }

            // Create download link with proper name
            const sanitizedName = folderName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const downloadUrl = response.result || response.url || window.URL.createObjectURL(await response.blob());

            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = `${sanitizedName}.zip`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up and update status
            document.body.removeChild(downloadStatusElem);
            setIsDownloading(false);
            setDownloadProgress(100);

            // Show success message
            const successElem = document.createElement('div');
            successElem.style.position = 'fixed';
            successElem.style.top = '20px';
            successElem.style.left = '50%';
            successElem.style.transform = 'translateX(-50%)';
            successElem.style.backgroundColor = 'rgba(39,174,96,0.9)';
            successElem.style.color = 'white';
            successElem.style.padding = '10px 20px';
            successElem.style.borderRadius = '5px';
            successElem.style.zIndex = '1000';
            successElem.innerText = 'Download started!';
            document.body.appendChild(successElem);

            // Remove success message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(successElem);
            }, 3000);

        } catch (error) {
            console.error("Error downloading folder as ZIP:", error);
            setIsDownloading(false);

            // Fallback to opening in Drive
            alert("Could not download folder directly. Opening in Google Drive instead.");
            window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
        }
    };

    // Handle Download
    const handleDownload = async (fileId, fileName, mimeType) => {
        try {
            // For folders, try to download as ZIP
            if (mimeType.includes('folder')) {
                await downloadFolderAsZip(fileId, fileName);
                return;
            }

            // For regular files, get download URL
            const response = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media',
                fields: 'webContentLink'
            });

            // Create an anchor element to trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
            downloadLink.target = '_blank';
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.error("Error downloading file:", error);
            // Open in Google Drive as fallback
            window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank');
        }
    };

    // Enhanced Search Function
    const handleSearch = () => {
        if (!searchTerm) {
            setSearchResults({ direct: [], indirect: [] });
            setIsSearching(false);
            return;
        }

        setIsLoading(true);
        setIsSearching(true);

        try {
            const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length > 0);
            const directMatches = [];
            const indirectMatches = [];

            // Process all files and categorize them
            allFilesAndFolders.forEach(item => {
                const itemNameLower = item.name.toLowerCase();
                const itemPathLower = (item.path || "").toLowerCase();

                // Check for direct matches - all terms must be present in either name or path
                const isDirectMatch = searchTerms.every(term =>
                    itemNameLower.includes(term) || itemPathLower.includes(term)
                );

                // Check for ordered phrase match (e.g., "digital test" as an exact phrase)
                const exactPhraseMatch = itemNameLower.includes(searchTerm.toLowerCase()) ||
                    itemPathLower.includes(searchTerm.toLowerCase());

                // Special case: if searching for something like "digital test", check if file is in a folder called "digital"
                // and has "test" in its name (or vice versa)
                const folderNameMatch = searchTerms.length >= 2 &&
                    searchTerms.some(term => itemPathLower.includes(term)) &&
                    searchTerms.some(term => itemNameLower.includes(term));

                if (isDirectMatch || exactPhraseMatch || folderNameMatch) {
                    directMatches.push(item);
                }
                // Indirect match - at least one term is found
                else if (searchTerms.some(term =>
                    itemNameLower.includes(term) || itemPathLower.includes(term))) {
                    indirectMatches.push(item);
                }
            });

            // Sort both categories: folders first, then files
            const sortResults = (results) => results.sort((a, b) => {
                if (a.mimeType.includes("folder") && !b.mimeType.includes("folder")) return -1;
                if (!a.mimeType.includes("folder") && b.mimeType.includes("folder")) return 1;
                return a.name.localeCompare(b.name);
            });

            setSearchResults({
                direct: sortResults(directMatches),
                indirect: sortResults(indirectMatches)
            });
        } catch (error) {
            console.error("Error searching files:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear search and go back to current folder view
    const clearSearch = () => {
        setSearchTerm("");
        setSearchResults({ direct: [], indirect: [] });
        setIsSearching(false);
    };

    useEffect(() => {
        document.title = languageText.DriveExplorer; // Change title when page loads
    }, []);


    // Render a file/folder card
    const renderCard = (file, showPath = false) => (
        <div key={file.id} className="p-4 rounded-lg shadow-xl bg-whitetheme/50 dark:bg-darktheme2/50 border-2 border-slate-300 dark:border-gray-700 ">
            <p className="font-semibold text-darktheme2 dark:text-whitetheme text-xl">{file.name}</p>

            {/* Always show path for ALL files and folders */}
            {file.path && (
                <p className="text-sm text-gray-500 mb-2">
                    Path: {file.path}
                </p>
            )}

            <div className="mt-2 flex flex-wrap  lg:justify-end gap-1">
                {/* Folder View */}
                {file.mimeType.includes("folder") ? (
                    <div className="flex flex-wrap gap-2 items-center justify-center lg:justify-end w-full">
                        <button
                            onClick={() => openFolder(file.id)}
                            className="drivePageButton bg-[#ffba49]"
                        >
                            <Icon icon="solar:folder-with-files-bold" />
                            {languageText.OpenFolder}
                        </button>
                        <button
                            onClick={() => downloadFolderAsZip(file.id, file.name)}
                            className="drivePageButton bg-[#ef5b5b]"
                            disabled={isDownloading}
                        >
                            <Icon icon="hugeicons:zip-02" />
                            {isDownloading ? languageText.Preparing : languageText.DownloadZip}
                        </button>
                        <a
                            href={`https://drive.google.com/drive/folders/${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="drivePageButton bg-[#20a39e]"
                        >
                            <Icon icon="mingcute:drive-fill" />
                            {languageText.OpenDrive}
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-1 w-full">
                        {/* PDF View */}
                        {file.mimeType === "application/pdf" ? (
                            <div className="w-full">
                                <iframe
                                    src={`https://drive.google.com/file/d/${file.id}/preview`}
                                    className="w-full h-60 border rounded-md"
                                    title={file.name}
                                ></iframe>
                                <div className="flex flex-wrap gap-2 mt-2 justify-end">
                                    <button
                                        onClick={() => handleDownload(file.id, file.name, file.mimeType)}
                                        className="drivePageButton bg-redtheme"
                                    >
                                        <Icon icon="mingcute:download-3-fill" />
                                        {languageText.Download}
                                    </button>
                                    <a
                                        href={file.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="drivePageButton bg-[#20a39e]"
                                    >
                                        <Icon icon="mingcute:drive-fill" />
                                        {languageText.OpenDrive}

                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 w-full justify-end">
                                <button
                                    onClick={() => handleDownload(file.id, file.name, file.mimeType)}
                                    className="drivePageButton bg-redtheme"
                                >
                                    <Icon icon="mingcute:download-3-fill" />
                                    {languageText.Download}
                                </button>
                                <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="drivePageButton bg-[#20a39e]"
                                >
                                    <Icon icon="mingcute:drive-fill" />
                                    {languageText.OpenDrive}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6">
            <h1 className="mt-20 text-6xl font-bold text-center text-redtheme dark:text-whitetheme">{languageText.DriveExplorer}</h1>

            {/* Status Indicator for data collection */}
            {isCollectingData && (
                <div className="text-center my-4 px-4 py-2 bg-red-100 rounded-md">
                    <p>{languageText.ScanningForGlobalSearch}</p>
                </div>
            )}

            {/* ZIP Download Progress */}
            {isDownloading && (
                <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                    ></div>
                </div>
            )}

            {/* Search Bar */}


            <div className="flex justify-center gap-3 my-4">
                {/* <input
                    type="text"
                    placeholder="Search across all accessible files and folders..."
                    className="p-2 border rounded-l-md w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                /> */}

                <button className={`flex text-[14px] px-4 items-center border-3 border-gray-700 rounded-lg shadow-xl group relative cursor-pointer text-whitetheme bg-[#3e6fc9] hover:scale-105 hover:-translate-y-1 transition-all duration-500 ease-in-out hover:text-xl`}
                    onClick={() => window.open(`https://drive.google.com/drive/u/4/folders/${id}`)}
                >
                    <Icon icon="mingcute:drive-fill" />
                    <div className="inputIconText bg-darktheme2">{languageText.DriveLink}</div>
                </button>

                <div
                    className={`flex text-[14px] items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg shadow-xl 
                        ${isFocused ? "focus-within:ring-2 focus-within:ring-gray-700 dark:focus-within:ring-darktheme focus-within:ring-offset-2 focus-within:ring-offset-whitetheme dark:focus-within:ring-offset-darktheme2" : ""}
                        ${searchTerm.length > 0 ? "ring-2 ring-offset-2 ring-offset-whitetheme dark:ring-offset-black !ring-green-500" : ""}`}>
                    {/* Search Icon */}
                    <div
                        className={`transition-all duration-300 group relative
                            ${isFocused ? "text-green-500 scale-110" : "text-darktheme dark:text-whitetheme2"} 
                            ${language === "en" ? "ml-4" : "mr-4"}`}
                    >
                        <Icon icon={`${searchTerm.length > 0 || isFocused ? "oui:ws-search" : "oui:ws-search"}`} />
                        <div className="inputIconText bg-darktheme2 !mb-5">{languageText.Search}</div>
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        spellCheck="false"
                        name="text"
                        value={searchTerm} // Controlled input value
                        className={`bg-transparent text-darktheme dark:text-whitetheme px-3 py-3 rounded-l-lg focus:outline-none w-30 text-sm focus:w-70 transition-all placeholder-gray-500 ${language === "en" ? "font-anton" : "font-modernpro "}`}
                        placeholder={languageText.Search}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    {/* Clear Button */}
                    <button
                        onClick={clearSearch} // Clear the input value
                        className={`transition-all duration-300 group relative text-darktheme dark:text-whitetheme2 cursor-pointer ${isFocused && searchTerm.length === 0 ? "!text-red-500 scale-110" : ""
                            } ${searchTerm.length > 0 ? "!text-green-500 scale-110" : ""} ${language === "en" ? "mr-3" : "ml-3"}`}
                    >
                        <Icon icon="solar:close-circle-broken" />
                        <div className="inputIconText bg-darktheme2">{languageText.Clear}</div>
                    </button>
                </div>

                {/* Search Button */}
                <button className={`flex text-[14px] px-4 items-center bg-gradient-to-r from-whitetheme/50 to-whitetheme2/50 dark:from-darktheme2/50 dark:to-darktheme/50 border-3 border-gray-700 rounded-lg shadow-xl group relative cursor-pointer dark:text-whitetheme hover:scale-105 hover:-translate-y-1 transition-all duration-500 ease-in-out hover:text-xl`}
                    onClick={handleSearch}
                    disabled={isCollectingData}
                >
                    <Icon icon="oui:ws-search" />
                    <div className="inputIconText bg-darktheme2">{languageText.Search}</div>
                </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mb-4 justify-center lg:justify-start">
                {folderStack.length > 1 && (
                    // <button onClick={goBack} className="px-3 py-2 bg-gray-500 text-white rounded-md">
                    //     ← Back
                    // </button>
                    <button
                        onClick={goBack}
                        className=" flex items-center gap-3 px-3 py-2 dark:border-darktheme ring-3 ring-redtheme border-3 border-whitetheme cursor-pointer text-white rounded-md hover:scale-105 hover:-translate-y-1 transition-all duration-500 ease-in-out bg-redtheme"
                    >
                        <Icon icon="icon-park-twotone:back" />
                        {languageText.Back}
                    </button>
                )}
                <button
                    onClick={goHome}
                    className=" flex items-center gap-3 px-3 py-2 bg-darktheme2 dark:border-darktheme ring-3 ring-darktheme2 border-3 border-whitetheme cursor-pointer text-white rounded-md hover:scale-105 hover:-translate-y-1 transition-all duration-500 ease-in-out"
                >
                    <Icon icon="codicon:root-folder-opened" />
                    {languageText.RootFolder}
                </button>
                {/* {isSearching && (
                    <button onClick={clearSearch} className="px-3 py-2 bg-red-500 text-white rounded-md">
                        Clear Search
                    </button>
                )} */}
            </div>

            {/* Loading Indicator */}
            {isLoading && <Loader text={languageText.Loading} />}

            {/* Search Results - Direct Matches */}
            {!isLoading && isSearching && searchResults.direct.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl text-redtheme dark:text-whitetheme font-semibold mb-4">
                        {languageText.DirectMatches}: <span className="text-gray-600 dark:text-gray-400 text-base">{searchResults.direct.length} {languageText.ItemsFound}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.direct.map((file) => renderCard(file, true))}
                    </div>
                </div>
            )}

            {/* Search Results - Indirect Matches */}
            {!isLoading && isSearching && searchResults.indirect.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl text-redtheme dark:text-whitetheme font-semibold mb-4">
                        {languageText.OtherMatches}: <span className="text-gray-600 dark:text-gray-400 text-base">{searchResults.indirect.length} {languageText.ItemsFound}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.indirect.map((file) => renderCard(file, true))}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {!isLoading && searchResults.direct.length === 0 && searchResults.indirect.length === 0 && isSearching && (
                <div className="flex items-center gap-3 text-center mt-8 bg-redtheme2 ring-3 ring-redtheme2 border-4 border-whitetheme dark:border-darktheme2 text-whitetheme w-fit p-4 rounded-xl m-auto">
                    <Icon icon="tabler:files-off" className="text-2xl" />
                    <p className="text-lg">{languageText.NoFilesFound}</p>
                </div>
            )}

            {/* File Explorer (only show when not in search mode) */}
            {!isLoading && !isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => renderCard(file, false))}
                </div>
            )}
            <ScrollToTop languageText={languageText} />

        </div>
    );
};

export default DriveExplorer;