import { Icon } from '@iconify/react';

const FacultyCard = ({ faculty, languageText }) => {


    const faculties = ({ icon, fac }) => {
        return (
            <>
                <Icon icon={icon} />
                <p>{languageText[fac]}</p>
            </>
        )
    }

    return (
        <>
            {faculty === "Electrical Engineering" ? (
                faculties({ icon: "material-symbols:electric-bolt-rounded", fac: 'FKE' })
            ) : faculty === "Computer Science" ? (
                faculties({ icon: "icon-park-solid:code-laptop", fac: 'FC' })
            ) : faculty === "Civil Engineering" ? (
                faculties({ icon: "fa6-solid:helmet-safety", fac: 'FKA' })
            ) : faculty === "Mechanical Engineering" ? (
                faculties({ icon: "vaadin:tools", fac: 'FKM' })
            ) : faculty === "Chemical Engineering" ? (
                faculties({ icon: "mdi:flask", fac: 'FKT' })
            ) : faculty === "Bridging & Foundation" ? (
                faculties({ icon: "icon-park-solid:book-one", fac: 'Space' })
            ) : faculty === "Architecture" ? (
                faculties({ icon: "tdesign:architecture-hui-style-filled", fac: 'FAB' })
            ) : (
                faculties({ icon: "icon-park-solid:book-one", fac: 'Space' })
            )}
        </>
    );
}

export default FacultyCard;