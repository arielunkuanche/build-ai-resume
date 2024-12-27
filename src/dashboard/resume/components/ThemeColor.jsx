import React, { useContext } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../../../components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';

function ThemeColor() {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const colors = [
        '#BA8CA4', '#358600','#23BE97','#03110E','#8E5572',
        '#105645','#947A61', '#C0960C', '#F2A0A1', '#2E3E4D',
        '#C85C41', '#D78A76', '#6687A3', '#B3B752', '#ED6C1D',
    ];
    const onSelectColor = (color) => {
        setResumeInfo({
            ...resumeInfo,
            themeColor: color    
        });   
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className='flex gap-2' variant='outline' size='sm'> <LayoutGrid /> Theme </Button>
            </PopoverTrigger>
            <PopoverContent>
                <h2 className='text-sm mb-2 font-semibold'>You can choose your resume theme color here.</h2>
                <div className='grid grid-cols-5 gap-2 p-2'>
                    {colors.map((color, index)=>(
                        <div key={index} className='cursor-pointer hover:shadow-lg border-black'>
                            <Button style={{backgroundColor:color}} className='h-6 w-6 rounded-full' onClick={()=>onSelectColor(color)}></Button>
                        </div>
                    ))}
                </div>
                
            </PopoverContent>
        </Popover>
                    
    )
}

export default ThemeColor