import { useFormContext } from "react-hook-form"
import { Space, Text, Checkbox, Group } from "@mantine/core"
import SelectMenu from "@/components/Forms/SelectMenu"
import Textarea from "@/components/Forms/TextArea"
import { getLogger } from "@/utils/logger/logger"

const logger = getLogger("SMOTServiceDetails")

const SMOTServiceDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6 pt-4">
      <Text size="lg" fw={500}>
        Service Details
      </Text>
      <Space h="md" />

      <SelectMenu
        label="Location"
        id="location"
        placeholder="Select Service Location"
        required
        error={errors.location?.message}
        {...register("location")}
      >
        <option value="">Select a location</option>
        <option value="North Region">North Region</option>
        <option value="South Region">South Region</option>
        <option value="East Region">East Region</option>
        <option value="West Region">West Region</option>
        <option value="Central Region">Central Region</option>
      </SelectMenu>

      <SelectMenu
        label="Service Status"
        id="serviceStatus"
        placeholder="Select Service Status"
        required
        error={errors.serviceStatus?.message}
        {...register("serviceStatus")}
      >
        <option value="Draft">Draft</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </SelectMenu>

      <div className="space-y-2">
        <Text size="sm" fw={500}>
          Service Configuration
        </Text>
        <Group>
          <Checkbox label="Single Activation" {...register("activationType.single")} />
          <Checkbox label="Dual Activation" {...register("activationType.dual")} />
        </Group>
      </div>

      <div className="space-y-2">
        <Text size="sm" fw={500}>
          Connection Type
        </Text>
        <Group>
          <Checkbox label="Point-to-Point (P2P)" {...register("connectionType.p2p")} />
          <Checkbox label="Point-to-Multipoint (P2MP)" {...register("connectionType.p2mp")} />
        </Group>
      </div>

      <Textarea
        label="Additional Notes"
        id="additionalNotes"
        placeholder="Enter any additional notes or special instructions"
        helperText="Optional information that might be helpful for service technicians"
        error={errors.additionalNotes?.message}
        {...register("additionalNotes")}
      />
    </div>
  )
}

export default SMOTServiceDetails
