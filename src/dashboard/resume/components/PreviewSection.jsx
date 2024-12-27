import React, { useContext } from 'react'
import { ResumeInfoContext } from '../../../context/ResumeInfoContext'
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummaryPreview from './preview/SummaryPreview';
import ProfessionalExperiencePreview from './preview/ProfessionalExperiencePreview';
import EducationPreview from './preview/EducationPreview';
import SkillsPreview from './preview/SkillsPreview';

function PreviewSection() {
    // to use the context we need to initiate state to take the value from the context
    // use curry braces to destructure the value from the context state
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    // console.log('Resume info in preview section: ', resumeInfo);
    return (
        <div className='shadow-lg h-full p-14 border-t-[20px]'
        style={{ borderColor:resumeInfo?.themeColor}}>
            {/* Personal details section */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            {/* summary section */}
            <SummaryPreview resumeInfo={resumeInfo} />
            {/* Professional experience section */}
            <ProfessionalExperiencePreview resumeInfo={resumeInfo} />
            {/* Education section */}
            <EducationPreview resumeInfo={resumeInfo} />
            {/* Skills section */}
            <SkillsPreview resumeInfo={resumeInfo} />
        </div>
    )
}

export default PreviewSection