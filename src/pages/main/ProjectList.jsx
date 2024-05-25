/* eslint-disable react/prop-types */
import { MdOutlineCalendarMonth } from 'react-icons/md'

function ProjectList({ name, desc, due }) {
    return (
        <>
            <li className="border flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                <div className="flex flex-col gap-2 leading-none capitalize">
                    <span className="font-semibold">{name}</span>
                    <p className="font-light">{desc}</p>
                </div>
                <div className="flex  justify-center items-center gap-2">
                    <span>Due on {due}</span>
                    <MdOutlineCalendarMonth />
                </div>
            </li>
        </>
    )
}

export default ProjectList