/* eslint-disable react/prop-types */

function Stast({ title, number }) {
    return (
        <>
            <div className="hover:bg-gray-50 w-[190px] rounded-md flex flex-col gap-3 py-2">
                <div className="flex flex-col border-l-4 border-green-600 px-2">
                    <h2 className="text-xl font-semibold capitalize">{title}</h2>
                    <span>All</span>
                </div>
                <h3 className="px-4 font-medium text-3xl">{number}</h3>
            </div>
        </>
    )
}

export default Stast