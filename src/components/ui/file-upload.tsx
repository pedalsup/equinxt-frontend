import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Upload, X, File, FileText, Eye, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: File[]
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxFileSize?: number
  disabled?: boolean
  error?: string
  placeholder?: string
}

interface FileWithPreview extends File {
  preview?: string
}

export const FileUpload = ({
  value = [],
  onChange,
  accept,
  multiple = false,
  maxFiles = 1,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  error,
  placeholder = "Click to upload or drag and drop",
}: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (disabled) return

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        console.warn("Some files were rejected:", rejectedFiles)
      }

      // Process accepted files
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = file as FileWithPreview

        // Create preview for images
        if (file.type.startsWith("image/")) {
          fileWithPreview.preview = URL.createObjectURL(file)
        }

        return fileWithPreview
      })

      // Simulate upload progress
      newFiles.forEach((file) => {
        const fileId = `${file.name}-${file.lastModified}`
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setUploadProgress((prev) => {
              const updated = { ...prev }
              delete updated[fileId]
              return updated
            })
          }
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }))
        }, 200)
      })

      // Update files
      if (multiple) {
        const totalFiles = [...value, ...newFiles]
        const limitedFiles = totalFiles.slice(0, maxFiles)
        onChange(limitedFiles)
      } else {
        onChange(newFiles.slice(0, 1))
      }
    },
    [value, onChange, multiple, maxFiles, disabled],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
    maxSize: maxFileSize,
    disabled,
  })

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (file.type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const previewFile = (file: FileWithPreview) => {
    if (file.preview) {
      window.open(file.preview, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium">{isDragActive ? "Drop files here..." : placeholder}</p>
          <p className="text-xs text-muted-foreground">
            {accept && `Accepted formats: ${accept}`}
            {maxFileSize && ` • Max size: ${formatFileSize(maxFileSize)}`}
            {multiple && maxFiles > 1 && ` • Max files: ${maxFiles}`}
          </p>
        </div>
      </div>

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({value.length})</h4>
          <div className="space-y-2">
            {value.map((file, index) => {
              const fileId = `${file.name}-${file.lastModified}`
              const progress = uploadProgress[fileId]
              const isUploading = progress !== undefined

              return (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <Badge variant="outline" className="text-xs">
                            {file.type || "Unknown"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Preview button for images */}
                      {file.type.startsWith("image/") && (file as FileWithPreview).preview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => previewFile(file as FileWithPreview)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Uploading... {Math.round(progress)}%</p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
