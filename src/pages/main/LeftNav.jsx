/* eslint-disable react/prop-types */

import { NavLink } from "react-router-dom"

function LeftNav({ name, icon, link }) {
    return (
        <>
            <NavLink to={"/" + link} className="flex items-center gap-2 p-2 border-b border-gray-400 cursor-pointer">
                {icon}
                <span>{name}</span>
            </NavLink>
        </>
    )
}

export default LeftNav