export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "select" | "radio" | "checkbox" | "textarea" | "number" | "date"
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    minDate?: Date | string
    maxDate?: Date | string
    custom?: (value: any) => string | null
  }
  conditional?: {
    dependsOn: string
    value: any
    operator?: "equals" | "not-equals" | "includes"
  }
}

export interface FormStep {
  id: string
  title: string
  description?: string
  fields: FormField[]
  conditional?: {
    dependsOn: string
    value: any
    operator?: "equals" | "not-equals" | "includes"
  }
}

export interface FormData {
  [key: string]: any
}

export interface FormErrors {
  [key: string]: string
}

export interface MultiStepFormProps {
  steps: FormStep[]
  onSubmit: (data: FormData) => Promise<void> | void
  onStepChange?: (currentStep: number, data: FormData) => void
  showProgressBar?: boolean
  allowBackNavigation?: boolean
  persistData?: boolean
  className?: string
  submitButtonText?: string
  nextButtonText?: string
  backButtonText?: string
}
