"use client"

import { useFormContext } from "react-hook-form"
import { Space, Text, Button, Group, Card } from "@mantine/core"
import { IconUpload, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { getLogger } from "@/utils/logger/logger"

const logger = getLogger("SMOTAttachments")

const SMOTAttachments = () => {
  const { setValue, getValues } = useFormContext()
  const [files, setFiles] = useState([])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    }))

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    setValue("attachments", updatedFiles)
  }

  const removeFile = (index) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)
    setValue("attachments", updatedFiles)
  }

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("word")) return "📝"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    return "📁"
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6 pt-4">
      <Text size="lg" fw={500}>
        Supporting Documents
      </Text>
      <Space h="md" />

      <Text size="sm" color="dimmed">
        Upload any supporting documents related to this service order (PDF, Word, Excel, Images). Maximum file size: 5MB
        per file.
      </Text>

      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Group position="center">
            <IconUpload size={24} />
            <Text>Click to upload or drag and drop</Text>
          </Group>
          <Text size="xs" color="dimmed" mt={8}>
            PDF, Word, Excel, JPG, PNG (Max 5MB each)
          </Text>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <Text size="sm" fw={500} mb={2}>
            Uploaded Files ({files.length})
          </Text>
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} p="xs" withBorder>
                <Group position="apart">
                  <Group>
                    <Text>{getFileIcon(file.type)}</Text>
                    <div>
                      <Text size="sm">{file.name}</Text>
                      <Text size="xs" color="dimmed">
                        {formatFileSize(file.size)}
                      </Text>
                    </div>
                  </Group>
                  <Button variant="subtle" color="red" compact onClick={() => removeFile(index)}>
                    <IconTrash size={16} />
                  </Button>
                </Group>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SMOTAttachments
