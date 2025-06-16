 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useMultiStepForm } from "../../hooks/use-multi-step-form"
import { FormField } from "./form-field"
import { ProgressBar } from "./progress-bar"
import type { MultiStepFormProps } from "../../types/form"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export const MultiStepForm = ({
  steps,
  onSubmit,
  onStepChange,
  showProgressBar = true,
  allowBackNavigation = true,
  persistData = false,
  className = "",
  submitButtonText = "Submit",
  nextButtonText = "Next",
  backButtonText = "Back",
}: MultiStepFormProps) => {
  const {
    currentStep,
    data,
    errors,
    isSubmitting,
    visitedSteps,
    setField,
    nextStep,
    prevStep,
    goToStep,
    setSubmitting,
    getVisibleSteps,
  } = useMultiStepForm(steps, persistData)

  const visibleSteps = getVisibleSteps()
  const currentStepData = visibleSteps[currentStep]
  const isLastStep = currentStep === visibleSteps.length - 1

  const handleSubmit = async () => {
    if (isLastStep) {
      setSubmitting(true)
      try {
        await onSubmit(data)
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setSubmitting(false)
      }
    } else {
      nextStep()
      onStepChange?.(currentStep + 1, data)
    }
  }

  const handleBack = () => {
    prevStep()
    onStepChange?.(currentStep - 1, data)
  }

  const handleStepClick = (step: number) => {
    goToStep(step)
    onStepChange?.(step, data)
  }

  if (!currentStepData) {
    return <div>No steps available</div>
  }

  // Filter fields based on conditional logic
  const visibleFields = currentStepData.fields.filter((field) => {
    if (!field.conditional) return true
    const dependentValue = data[field.conditional.dependsOn]
    const operator = field.conditional.operator || "equals"

    switch (operator) {
      case "not-equals":
        return dependentValue !== field.conditional.value
      case "includes":
        return Array.isArray(dependentValue) ? dependentValue.includes(field.conditional.value) : false
      case "equals":
      default:
        return dependentValue === field.conditional.value
    }
  })

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        {showProgressBar && (
          <ProgressBar
            currentStep={currentStep}
            totalSteps={visibleSteps.length}
            visitedSteps={visitedSteps}
            onStepClick={handleStepClick}
            allowClickNavigation={allowBackNavigation}
          />
        )}
        <CardTitle>{currentStepData.title}</CardTitle>
        {currentStepData.description && <CardDescription>{currentStepData.description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-6">
        {visibleFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={data[field.name]}
            error={errors[field.name]}
            onChange={(value) => setField(field.name, value)}
          />
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || !allowBackNavigation}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {backButtonText}
        </Button>

        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLastStep ? submitButtonText : nextButtonText}
          {!isLastStep && <ChevronRight className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
