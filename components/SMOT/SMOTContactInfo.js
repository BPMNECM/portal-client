"use client"

import { useFormContext } from "react-hook-form"
import { Space, Text, Switch } from "@mantine/core"
import Input from "@/components/Forms/Input"
import { getLogger } from "@/utils/logger/logger"
import { useState } from "react"

const logger = getLogger("SMOTContactInfo")

const SMOTContactInfo = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [useDefaultContact, setUseDefaultContact] = useState(false)

  const handleUseDefaultContact = (e) => {
    const isChecked = e.target.checked
    setUseDefaultContact(isChecked)

    if (isChecked) {
      // Set default contact information
      setValue("contactName", "John Doe", { shouldValidate: true })
      setValue("contactEmail", "john.doe@example.com", { shouldValidate: true })
      setValue("contactPhone", "555-123-4567", { shouldValidate: true })
    } else {
      // Clear contact information
      setValue("contactName", "", { shouldValidate: true })
      setValue("contactEmail", "", { shouldValidate: true })
      setValue("contactPhone", "", { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-6 pt-4">
      <Text size="lg" fw={500}>
        Contact Information
      </Text>
      <Space h="md" />

      <div className="mb-4">
        <Switch
          label="Use default contact information"
          checked={useDefaultContact}
          onChange={handleUseDefaultContact}
        />
      </div>

      <Input
        label="Contact Name"
        id="contactName"
        placeholder="Enter contact name"
        required
        error={errors.contactName?.message}
        {...register("contactName")}
      />

      <Input
        label="Contact Email"
        id="contactEmail"
        type="email"
        placeholder="Enter contact email"
        required
        error={errors.contactEmail?.message}
        {...register("contactEmail")}
      />

      <Input
        label="Contact Phone"
        id="contactPhone"
        placeholder="Enter contact phone number"
        required
        error={errors.contactPhone?.message}
        {...register("contactPhone")}
      />
    </div>
  )
}

export default SMOTContactInfo
