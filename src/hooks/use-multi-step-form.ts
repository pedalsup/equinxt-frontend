import { useReducer, useCallback, useEffect } from "react"
import type { FormData, FormErrors, FormStep } from "../types/form"
import { format } from "date-fns"

interface FormState {
  currentStep: number
  data: FormData
  errors: FormErrors
  isSubmitting: boolean
  visitedSteps: Set<number>
}

type FormAction =
  | { type: "SET_FIELD"; field: string; value: any }
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "CLEAR_ERRORS" }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "RESET_FORM" }
  | { type: "LOAD_DATA"; data: FormData }

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: "" },
      }
    case "SET_ERRORS":
      return { ...state, errors: action.errors }
    case "CLEAR_ERRORS":
      return { ...state, errors: {} }
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: state.currentStep + 1,
        visitedSteps: new Set([...state.visitedSteps, state.currentStep + 1]),
      }
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      }
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.step,
        visitedSteps: new Set([...state.visitedSteps, action.step]),
      }
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting }
    case "RESET_FORM":
      return {
        currentStep: 0,
        data: {},
        errors: {},
        isSubmitting: false,
        visitedSteps: new Set([0]),
      }
    case "LOAD_DATA":
      return { ...state, data: action.data }
    default:
      return state
  }
}

export const useMultiStepForm = (steps: FormStep[], persistData = false) => {
  const [state, dispatch] = useReducer(formReducer, {
    currentStep: 0,
    data: {},
    errors: {},
    isSubmitting: false,
    visitedSteps: new Set([0]),
  })

  // Load persisted data on mount
  useEffect(() => {
    if (persistData) {
      const savedData = localStorage.getItem("multiStepFormData")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          dispatch({ type: "LOAD_DATA", data: parsedData })
        } catch (error) {
          console.error("Failed to load persisted form data:", error)
        }
      }
    }
  }, [persistData])

  // Persist data when it changes
  useEffect(() => {
    if (persistData && Object.keys(state.data).length > 0) {
      localStorage.setItem("multiStepFormData", JSON.stringify(state.data))
    }
  }, [state.data, persistData])

  const setField = useCallback((field: string, value: any) => {
    dispatch({ type: "SET_FIELD", field, value })
  }, [])

  const validateStep = useCallback(
    (stepIndex: number): boolean => {
      const step = steps[stepIndex]
      if (!step) return true

      const errors: FormErrors = {}
      let isValid = true

      step.fields.forEach((field) => {
        // Check conditional rendering
        if (field.conditional) {
          const dependentValue = state.data[field.conditional.dependsOn]
          const shouldShow = checkConditional(dependentValue, field.conditional.value, field.conditional.operator)
          if (!shouldShow) return
        }

        const value = state.data[field.name]

        // Required field validation
        if (field.required && (!value || (typeof value === "string" && value.trim() === ""))) {
          errors[field.name] = `${field.label} is required`
          isValid = false
          return
        }

        // Skip other validations if field is empty and not required
        if (!value) return

        // Type-specific validation
        if (field.type === "email" && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            errors[field.name] = "Please enter a valid email address"
            isValid = false
          }
        }

        // Date validation
        if (field.type === "date" && value) {
          const dateValue = new Date(value)

          if (field.validation?.minDate) {
            const minDate = new Date(field.validation.minDate)
            if (dateValue < minDate) {
              errors[field.name] = `${field.label} must be after ${format(minDate, "PPP")}`
              isValid = false
            }
          }

          if (field.validation?.maxDate) {
            const maxDate = new Date(field.validation.maxDate)
            if (dateValue > maxDate) {
              errors[field.name] = `${field.label} must be before ${format(maxDate, "PPP")}`
              isValid = false
            }
          }
        }

        // Custom validation rules
        if (field.validation) {
          const { pattern, minLength, maxLength, min, max, custom } = field.validation

          if (pattern && !pattern.test(value)) {
            errors[field.name] = `${field.label} format is invalid`
            isValid = false
          }

          if (minLength && value.length < minLength) {
            errors[field.name] = `${field.label} must be at least ${minLength} characters`
            isValid = false
          }

          if (maxLength && value.length > maxLength) {
            errors[field.name] = `${field.label} must be no more than ${maxLength} characters`
            isValid = false
          }

          if (min !== undefined && Number(value) < min) {
            errors[field.name] = `${field.label} must be at least ${min}`
            isValid = false
          }

          if (max !== undefined && Number(value) > max) {
            errors[field.name] = `${field.label} must be no more than ${max}`
            isValid = false
          }

          if (custom) {
            const customError = custom(value)
            if (customError) {
              errors[field.name] = customError
              isValid = false
            }
          }
        }
      })

      dispatch({ type: "SET_ERRORS", errors })
      return isValid
    },
    [steps, state.data],
  )

  const nextStep = useCallback(() => {
    if (validateStep(state.currentStep)) {
      dispatch({ type: "NEXT_STEP" })
    }
  }, [validateStep, state.currentStep])

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" })
  }, [])

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "GO_TO_STEP", step })
  }, [])

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" })
    if (persistData) {
      localStorage.removeItem("multiStepFormData")
    }
  }, [persistData])

  // Get visible steps based on conditional logic
  const getVisibleSteps = useCallback(() => {
    return steps.filter((step) => {
      if (!step.conditional) return true
      const dependentValue = state.data[step.conditional.dependsOn]
      return checkConditional(dependentValue, step.conditional.value, step.conditional.operator)
    })
  }, [steps, state.data])

  return {
    ...state,
    setField,
    validateStep,
    nextStep,
    prevStep,
    goToStep,
    setSubmitting,
    resetForm,
    getVisibleSteps,
  }
}

const checkConditional = (value: any, expectedValue: any, operator = "equals"): boolean => {
  switch (operator) {
    case "not-equals":
      return value !== expectedValue
    case "includes":
      return Array.isArray(value) ? value.includes(expectedValue) : false
    case "equals":
    default:
      return value === expectedValue
  }
}
