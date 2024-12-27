import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import Summary from './forms/Summary'
import {Button} from '../../../components/ui/button'
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import { Link, Navigate, useParams } from 'react-router-dom'
import ViewResume from '../../../my-resume/[resumeId]/view'
import ThemeColor from './ThemeColor'

function FormSection() {
    const [activeFormIndex, setActiveFormIndex] = useState(1) //setup the form view page index state to navigate pagination
    const [enableNext, setEnableNext] = useState(true);
    const params = useParams();
    return (
        <div>
            <div className='flex justify-between items-center my-4'>
                <div className='flex gap-5'>
                    <Link to='/dashboard'>
                        <Button><Home /></Button>
                    </Link>
                    <ThemeColor />
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