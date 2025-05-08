import { useFormContext } from "react-hook-form"
import { Space, Text } from "@mantine/core"
import SelectMenu from "@/components/Forms/SelectMenu"
import Input from "@/components/Forms/Input"
import Textarea from "@/components/Forms/TextArea"
import { getLogger } from "@/utils/logger/logger"

const logger = getLogger("SMOTBasicInfo")

const SMOTBasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6 pt-4">
      <Text size="lg" fw={500}>
        Basic Information
      </Text>
      <Space h="md" />

      <Input
        label="Service Order ID"
        id="serviceOrderId"
        placeholder="Enter Service Order ID"
        required
        error={errors.serviceOrderId?.message}
        {...register("serviceOrderId")}
      />

      <SelectMenu
        label="Service Type"
        id="serviceType"
        placeholder="Select Service Type"
        required
        error={errors.serviceType?.message}
        {...register("serviceType")}
      >
        <option value="">Select a service type</option>
        <option value="Installation">Installation</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Repair">Repair</option>
        <option value="Upgrade">Upgrade</option>
        <option value="Decommission">Decommission</option>
      </SelectMenu>

      <Textarea
        label="Service Description"
        id="description"
        placeholder="Enter service description"
        helperText="Provide detailed information about the service order requirements"
        required
        error={errors.description?.message}
        {...register("description")}
      />

      <SelectMenu
        label="Priority"
        id="priority"
        placeholder="Select Priority Level"
        required
        error={errors.priority?.message}
        {...register("priority")}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </SelectMenu>

      <Input
        label="Requested Completion Date"
        id="requestedCompletionDate"
        type="date"
        required
        error={errors.requestedCompletionDate?.message}
        {...register("requestedCompletionDate")}
      />
    </div>
  )
}

export default SMOTBasicInfo
