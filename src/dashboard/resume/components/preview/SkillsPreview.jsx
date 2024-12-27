import React from 'react'

function SkillsPreview({resumeInfo}) {
    return (
    <div>
        <h2 className='font-bold text-sm mb-2 text-center'style={{ color:resumeInfo?.themeColor }}>
            Skills
        </h2>
        <hr style={{ borderColor:resumeInfo?.themeColor }}/>
        <div className='grid grid-cols-2 gap-3 my-4'>
            {resumeInfo?.skills.map((item, index)=>(
                <div key={index} className='flex items-center justify-between'>
                    <h2 className='text-xs'>{item.name}</h2>
                    <div className='h-2 bg-gray-200 w-[120px]'>
                        <div className='h-2' style={{backgroundColor: resumeInfo?.themeColor, width:item?.rating*20 + '%'}}></div>
                        {/* before implementing the react-rating, the width shows resumeInfo default skills.rating actual number, but now it *20 to display rating */}
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}

export default SkillsPreview