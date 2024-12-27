import React, { useEffect, useState } from 'react';
import DomPurify from 'dompurify';

function EducationPreview({ resumeInfo }) {
    const [education, setEducation] = useState([]);
    useEffect(()=>{
        setEducation(resumeInfo?.education)
    },[resumeInfo]);
    
    return (
        <div>
            <h2 className='font-bold text-sm mb-2 text-center'style={{ color:resumeInfo?.themeColor }}>
                Education
            </h2>
            <hr style={{ borderColor:resumeInfo?.themeColor }}/>
            {education && education.map((item, index)=>(
                <div key={index} className='my-4'>
                    <h2 className='font-bold text-sm' style={{ color:resumeInfo?.themeColor }}>{item.universityName}</h2>
                    <h2 className='text-xs flex justify-between'>{item.degree} in {item.major}
                        <span>{item.startDate} - {item.endDate}</span>
                    </h2>
                    {/* <p className='text-xs my-2'>{item.description}</p>  */}
                    <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(item?.description)}} className='text-xs my-2'></div> 
                </div>
            ))}
        </div>
    )
}

export default EducationPreview