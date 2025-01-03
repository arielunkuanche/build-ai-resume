import React, { useContext, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '../../../components/ui/button';
import { LayoutGrid, LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../service/GlobalApi';
import { useToast } from "@/hooks/use-toast";

function ThemeColor() {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor);
    const [loading, setLoading] = useState(false);
    const { toast }  = useToast();
    const colors = [
        '#BA8CA4', '#358600','#23BE97','#03110E','#8E5572',
        '#105645','#947A61', '#C0960C', '#F2A0A1', '#2E3E4D',
        '#C85C41', '#D78A76', '#6687A3', '#B3B752', '#ED6C1D',
    ];
    const onSelectColor = (color) => {
        setSelectedColor(color);
        setResumeInfo({
            ...resumeInfo,
            themeColor: color    
        });
        console.log('Selected color in resumeInfo: ', resumeInfo.themeColor);
    };
    const onSaveColor = async () => {
        setLoading(true);
        const data = {
            data: {
                themeColor: selectedColor
            }
        };
        try {
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            console.log('Theme color update: ', resp);
            if(resp){
                toast({
                    title: 'Success',
                    description: 'Theme color updated successfully!'
                })
            }else{
                toast({
                    title: 'Error',
                    description: 'Error updating theme color!'
                })
            }
        } catch (error) {
            console.error('Error updating theme color: ', error.message);
        } finally {
            setLoading(false);
        }  
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
                    <Button className='mt-3 flex justify-end' size='sm' disabled={loading} onClick={onSaveColor}>
                        {loading ? <LoaderCircle className='animate-spin' size={20} /> : "Save"}
                    </Button>
            </PopoverContent>
        </Popover>
                    
    )
}

export default ThemeColor