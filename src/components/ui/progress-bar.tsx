import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  visitedSteps: Set<number>
  onStepClick?: (step: number) => void
  allowClickNavigation?: boolean
}

export const ProgressBar = ({
  currentStep,
  totalSteps,
  visitedSteps,
  onStepClick,
  allowClickNavigation = false,
}: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
      </div>

      <Progress value={progress} className="w-full" />

      {allowClickNavigation && (
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }, (_, index) => (
            <button
              key={index}
              onClick={() => onStepClick?.(index)}
              disabled={!visitedSteps.has(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : visitedSteps.has(index)
                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                    : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
