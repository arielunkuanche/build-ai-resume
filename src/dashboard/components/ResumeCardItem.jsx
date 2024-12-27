import { LoaderCircle, MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx"
import GlobalApi from '../../../service/GlobalApi';
import { useToast } from "@/hooks/use-toast";

function ResumeCardItem({ resume, refreshData }) {
    //console.log('Resume card item object: ', resume);
    const navigation = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const handleDelete = async() => {
        try {
            setLoading(true);
            const resp = await GlobalApi.DeleteResumeById(resume.documentId);
            console.log('Delete resume response: ', resp);
            if(resp){
                // navigation('/dashboard');
                toast({
                    title:'Success',
                    description:'Resume deleted!',
                });
                refreshData(); // refresh the data after deleting the resume and pass this prop to the parent component Dashboard index.jsx
            }
        } catch (error) {
            console.log('Error deleting resume: ', error.message);
        } finally {
            setIsOpen(false);
            setLoading(false);
        }
    };
    return (
        <div>
            {/* the id is the data json object property instead of using documentId */}
            <Link to = {'/dashboard/resume/'+ resume.documentId + "/edit"}> 
                <div className='p-14 bg-gradient-to-b from-teal-400 to-blue-500 hover:from-purple-500 hover:to-pink-500  ...'
                style = {{ borderColor: "#41D1B7"}}
                >
                    <div className='flex items-center justify-center h-[180px] '>
                        {/* <Notebook/> */}
                        <img src="/resume.png" width={100} height={100} />
                    </div>
                </div>
            </Link>
            <div className = 'border p-3 flex justify-between bg-transparent text-black rounded-b-lg shadow-lg'>
                <h2 className='text-sm'>{resume.title}</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                    <MoreVertical className='h-4 w-4 cursor-pointer'/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={()=>navigation('/dashboard/resume/'+ resume.documentId + '/edit')} >Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>navigation('/my-resume/'+ resume.documentId + '/view')}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>navigation('/my-resume/'+ resume.documentId + '/view')}>Download</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>setIsOpen(true)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
            <AlertDialog open={isOpen}>
                <AlertDialogContent >
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. 
                        This will permanently delete your resume data.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>setIsOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>handleDelete()} disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' size={20} /> : 'Continue'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
            
        </div>
    )
}

export default ResumeCardItem