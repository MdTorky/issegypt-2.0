import React from 'react'

const SmallLoader = () => {
    return (
        /* From Uiverse.io by yohohopizza */
        <div className="flex flex-row gap-2 m-auto">
            <div className="w-4 h-4 rounded-full bg-redtheme animate-bounce"></div>
            <div
                className="w-4 h-4 rounded-full bg-redtheme2 animate-bounce [animation-delay:-.3s]"
            ></div>
            <div
                className="w-4 h-4 rounded-full bg-redtheme animate-bounce [animation-delay:-.5s]"
            ></div>
        </div>

    )
}

export default SmallLoader