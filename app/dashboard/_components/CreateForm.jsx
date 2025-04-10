"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AiChatSession } from '@/configs/AiModal'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
  

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const route = useRouter();

    const PROMPT = ", On the Basis of Description Please give Form in json format with Form Title, Form Subheading with having Form field properties like name, placeholder, label, type, title, required, in json format, But never give a field type file"

    const onCreateForm = async () => {

      console.log(userInput);
      setLoading(true);
      const result = await AiChatSession.sendMessage("Description: " + userInput + PROMPT);
      console.log(result.response.text());
      if(result.response.text()) 
      {
        const resp = await db.insert(JsonForms)
        .values({
            jsonform: result.response.text(),
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD/MM/YYYY')
        }).returning({id: JsonForms.id})

        console.log("New Form ID: ",resp[0].id);
        if (resp[0].id) {
          route.push(`/edit-form/${resp[0].id}`);
        }
        setLoading(false);
      }
      setLoading(false);
    }

  return (
    <>
        <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
        <Dialog open={openDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>
                  <Textarea className="my-2" placeholder="Write description of your form" value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                  <div className='flex gap-2 my-3 justify-end'>
                    <Button variant="destructive" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={onCreateForm} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" /> : "Create" }
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CreateForm