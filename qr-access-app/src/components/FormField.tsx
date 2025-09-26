import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  label: string
  inputType: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  inputType,
  placeholder,
  value,
  onChange,
  required,
}: FormFieldProps) => {
  return (
    <div className='space-y-2'>
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className='w-full'
      />
    </div>
  )
}
