import React, { useRef, useState } from 'react'
import FieldEdit from './FieldEdit'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db } from '@/configs'
import { userResponses } from '@/configs/schema'
import moment from 'moment/moment'
import { toast } from 'sonner'
import { SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'


function FormUi({ jsonForm, onFieldUpdate, deleteField, selectedTheme, selectedStyle, editable = true, formId=0, enabledSignIn = false }) {
  
  const [formData, setFormData] = useState();
  let formRef = useRef();
  const { user, isSignedIn } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);

    const result =  await db.insert(userResponses)
    .values({
      jsonResponse: formData,
      createdAt: moment().format('DD-MM-YYYY'),
      formRef: formId
    }) 

    if(result) {
      formRef.reset();
      toast.success("Form Submitted Successfully!!!!!!!!!");
    } else {
      toast.error("Error Occured While Submitting Form!!!!!!!!!");
    }
  }

  const handleCheckboxChange = (name, option, value) => {
    const list = formData?.[name]?formData?.[name]:[];
    console.log(list);
    if(value) {
      list.push({
        label: option,
        value: value
      })
      setFormData({ ...formData, [name]: list })
    } else {
      const result = list.filter((item) => item.value !== value);
      setFormData({ ...formData, [name]: result })
    }
  }

  return (
    <>
      <form ref={(e) => formRef = e} onSubmit={onFormSubmit} className='border p-5 md:w-[600px] rounded-lg' data-theme={selectedTheme} style={{[selectedStyle?.key]: selectedStyle?.value}}>
        <h2 className='font-bold text-center text-2xl'>{jsonForm?.formTitle}</h2>
        <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.formSubheading}</h2>

        {jsonForm?.formFields?.map((field, index) => (
          <div key={index} className='flex items-center gap-2'>
            {field.type === 'select' ? 
              <div className='my-3 w-full'>
                <Label htmlFor={field.name} className='text-xs'>{field.label}</Label>
                <Select required={field?.required} onValueChange={(value) => handleSelectChange(field.name, value)} name={field.name}> 
                  <SelectTrigger className='w-full bg-transparent'>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            : field.type === 'radio' ? 
              <div className='my-3 w-full'>
                <Label htmlFor={field.name} className='text-xs'>{field.label}</Label>
                <RadioGroup required={field?.required}>
                  {field.options.map((option, index) => (
                    <div className='flex items-center space-x-2' key={index}>
                      <RadioGroupItem value={option.value} id={option.value} 
                        onClick={(value) => handleSelectChange(field.name, option.label, value)} name={field.name} 
                      />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            : field.type === 'textarea' ? 
              <div className='my-3 w-full'>
                <Label htmlFor={field.name} className='text-xs'>{field.label}</Label>
                <Textarea 
                  placeholder={field.placeholder}  
                  type={field?.type} 
                  name={field.name} 
                  rows={5}
                  className='bg-transparent'
                  onChange={(e) => handleInputChange(e)}
                  required={field?.required} 
                />
              </div>
            : field.type === 'checkbox' ?
              <div className='my-3 w-full'>
                <Label htmlFor={field.name} className='text-xs'>{field.label}</Label>
                {field?.options 
              ? field?.options?.map((option, index) => (
                  <div className='flex items-center space-x-2 my-1' key={index}>
                    <Checkbox id={option.label} value={option.value} name={field.name} 
                      onCheckedChange={(value) => handleCheckboxChange(field.name, option.label, value)}
                    />
                    <Label htmlFor={option.label}>{option.label}</Label>
                  </div>
                ))
              : <div className='my-3 flex items-center space-x-2'>
                  <Checkbox id={field.label} value={field.value} name={field.name} required={field.required}/>
                  <Label htmlFor={field.label}>{field.label}</Label>
                </div>
              }
              </div>
            : <div className='my-3 w-full'>
                <Label htmlFor={field.name} className='text-xs'>{field.label}</Label>
                <Input 
                  placeholder={field.placeholder}  
                  type={field?.type} 
                  name={field.name}
                  min={field?.min}
                  max={field?.max}
                  className='bg-transparent'
                  onChange={(e) => handleInputChange(e)}
                  required={field?.required} 
                />
              </div>}

              {editable && 
                <div>
                  <FieldEdit defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => deleteField(index)} />
                </div>
              }
          </div>
        ))}

        {
          !enabledSignIn ? <button className='btn btn-primary w-44' type='submit'>Submit</button> :
          isSignedIn ? <button className='btn btn-primary w-44' type='submit'>Submit</button> 
          : <Button> <SignInButton mode='modal'>Sign In before Submit</SignInButton> </Button>
        }
        
      </form>
    </>
  )
}

export default FormUi