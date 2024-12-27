import React, { useEffect, useState } from 'react';
import DomPurify from 'dompurify'; // library to sanitize the html content avoid XSS attack

function ProfessionalExperiencePreview({ resumeInfo }) {
    const [professionalExperience, setProfessionalExperience] = useState([]);
    useEffect(()=>{
        setProfessionalExperience(resumeInfo?.experience)
    },[resumeInfo]);
    return (
    <div className='my-6'>
        <h2 className='font-bold text-sm mb-2 text-center'style={{ color:resumeInfo?.themeColor }}>
            Professional Experience
        </h2>
        <hr style={{ borderColor:resumeInfo?.themeColor }}/>
        {professionalExperience && professionalExperience.map((experience, index)=>(
            <div key={index} className='my-4'>
                <h2 className='font-bold text-sm' style={{ color:resumeInfo?.themeColor }}>{experience.title}</h2>
                <h2 className='text-xs flex justify-between'>{experience.companyName}, {experience.city}, {experience.state}
                    <span>{experience.startDate} - {experience.currentlyWorking? 'Present' : experience.endDate}</span>
                </h2>
                {/* // instead of using original p tag, using dangerouslySetInnerHTML to display the richTextEditor content */}
                {/* <p className='text-xs my-2'>{experience.workSummery}</p> */}
                <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(experience?.workSummery)}} className='text-xs my-2'></div> 
                
            </div>
        ))}
    </div>
    )
}

export default ProfessionalExperiencePreview