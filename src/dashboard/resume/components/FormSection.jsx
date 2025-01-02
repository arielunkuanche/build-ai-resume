import React, { useContext, useEffect, useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import Summary from './forms/Summary';
import {Button} from '../../../components/ui/button';
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import ViewResume from '../../../my-resume/[resumeId]/view';
import ThemeColor from './ThemeColor';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { Input } from '../../../components/ui/input';
import GlobalApi from '../../../../service/GlobalApi';

function FormSection() {
    const [activeFormIndex, setActiveFormIndex] = useState(1) //setup the form view page index state to navigate pagination
    const [enableNext, setEnableNext] = useState(true);
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [saveTimeout, setSaveTimeout] = useState(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResumeInfo({
            ...resumeInfo,
            [name]: value
        });
        // clear previous timeout
        if(saveTimeout){
            clearTimeout(saveTimeout);
        }
        // set a new timeout to save the title after 2 seconds using setTimeout Node.js function
        const newTimeout = setTimeout(() => {
            onChangeResumeTitle(value);
        }, 2000);

        setSaveTimeout(newTimeout);
    };
    const onChangeResumeTitle = async(newTitle) =>{
        const data = {
            data: {
                title: newTitle
            }
        }
        //console.log('Data in form section resume title: ', data);
        try {
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            if(resp) {
                console.log('Resume title updated successfully in form section: ', resp);
            } else {
                console.log('Error updating resume title: ', resp);
            }
        } catch (error) {
            console.error('Error in updating resume title in form section: ', error.message);
        }
    };
    
    return (
        <div>
            <div className='flex justify-between items-center my-4'>
                <div className='flex gap-5'>
                    <Link to='/dashboard'>
                        <Button><Home /></Button>
                    </Link>
                    <ThemeColor />
                    <div className='grid grid-cols-3 gap-2'>
                        <Button variant='outlined'> Your Resume Title: </Button>
                        <Input name='title' defaultValue={resumeInfo?.title} onChange={(e)=>handleInputChange(e)}></Input>
                    </div>
                </div>
                <div className='flex gap-2' size='sm'>
                    {activeFormIndex > 1 && 
                        <Button onClick={ ()=> setActiveFormIndex(activeFormIndex - 1)}> <ArrowLeft /> </Button>}
                    <Button disabled={!enableNext} onClick={ ()=> setActiveFormIndex(activeFormIndex + 1)}>
                        Next <ArrowRight />
                    </Button>
                </div>
            </div>
            {/* Navigate to each resume component by activating index state */}
            {/* Pass the enableNext value from component prop to here enableNext state*/}
            {activeFormIndex == 1? <PersonalDetail enableNext={(e)=>setEnableNext(e)} /> : null} 
            {activeFormIndex == 2? <Summary enableNext={(e)=>setEnableNext(e)}/> : null}
            {activeFormIndex == 3? <Experience enableNext={(e)=>setEnableNext(e)}/> : null}
            {activeFormIndex == 4? <Education enableNext={(e)=>setEnableNext(e)}/> : null}
            {activeFormIndex == 5? <Skills enableNext={(e)=>setEnableNext(e)}/>: null}
            {activeFormIndex == 6? 
                <Navigate to={'/my-resume/'+params?.resumeId+'/view'} /> : null
            }
            
        </div>
    )
}

export default FormSection