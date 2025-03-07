const MemberLoader = ({ languageText, committee, role }) => {


    if (committee === "Admin" && role === "Admin") {
        return languageText.Admin
    }
    else if (committee === "ISS Egypt" && role === "President") {
        return languageText.President
    }
    else if (committee === "Vice" && role === "President") {
        return languageText.VicePresident
    }
    else if (committee === "Secretary" && role === "President") {
        return languageText.Secretary
    }
    else if (committee === "Treasurer" && role === "President") {
        return languageText.Treasurer
    }
    else if (committee === "Academic" && role === "President") {
        return languageText.AcademicPresident
    }
    else if (committee === "Bank" && role === "President") {
        return languageText.BankPresident
    }
    else if (committee === "Social" && role === "President") {
        return languageText.SocialPresident
    }
    else if (committee === "Culture" && role === "President") {
        return languageText.CulturePresident
    }
    else if (committee === "Sports" && role === "President") {
        return languageText.SportPresident
    }
    else if (committee === "Media" && role === "President") {
        return languageText.MediaPresident
    }
    else if (committee === "Logistics" && role === "President") {
        return languageText.LogisticsPresident
    }
    else if (committee === "WomenAffairs" && role === "President") {
        return languageText.WomenPresident
    }
    else if (committee === "PR" && role === "President") {
        return languageText.PublicRelation
    }
    else if (committee === "HR" && role === "President") {
        return languageText.HR
    }
    else if (committee === "Reading" && role === "President") {
        return languageText.ReadingPresident
    }
    else if (committee === "Reading" && role === "VicePresident") {
        return languageText.ReadingVicePresident
    }
    else if (committee === "Academic" && (role === "Member" || role === "BestMember")) {
        return languageText.AcademicMember
    }
    else if (committee === "Bank" && (role == "Member" || role == "BestMember")) {
        return languageText.BankMember
    }
    else if (committee === "Social" && (role == "Member" || role == "BestMember")) {
        return languageText.SocialMember
    }
    else if (committee === "Culture" && (role == "Member" || role == "BestMember")) {
        return languageText.CultureMember
    }
    else if (committee === "Sports" && (role == "Member" || role == "BestMember")) {
        return languageText.SportMember
    }
    else if (committee === "Media" && (role == "Member" || role == "BestMember")) {
        return languageText.MediaMember
    }
    else if (committee === "Logistics" && (role == "Member" || role == "BestMember")) {
        return languageText.LogisticsMember
    }
    else if (committee === "WomenAffairs" && (role == "Member" || role == "BestMember")) {
        return languageText.WomenMember
    }
    else if (committee === "PR" && role === "Member") {
        return languageText.PublicRelation
    }
    else if (committee === "Reading" && (role == "Member" || role == "BestMember")) {
        return languageText.ReadingMember
    }
}
export default MemberLoader;