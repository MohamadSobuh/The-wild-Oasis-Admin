import { useState } from "react";
import { useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Select from "../../ui/Select";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

import { useCabins } from "../cabins/useCabins";
import { useGuests } from "./useGuests";
import { useSettings } from "../settings/useSettings";
import { useCreateBooking } from "./useCreateBooking";
import { subtractDates } from "../../utils/helpers";

function CreateBookingForm({ onCloseModal }) {
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const { guests, isLoading: isLoadingGuests } = useGuests();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { createBooking, isCreating } = useCreateBooking();

  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const { register, handleSubmit, getValues, formState, reset } = useForm();
  const { errors } = formState;

  const isLoading = isLoadingCabins || isLoadingGuests || isLoadingSettings;
  if (isLoading) return <Spinner />;

  function onSubmit(data) {
    const cabin = cabins.find((c) => c.id === Number(data.cabinId));
    const numNights = subtractDates(data.endDate, data.startDate);
    const numGuests = Number(data.numGuests);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = hasBreakfast
      ? numNights * settings.breakfastPrice * numGuests
      : 0;

    createBooking(
      {
        cabinId: Number(data.cabinId),
        guestId: Number(data.guestId),
        startDate: data.startDate,
        endDate: data.endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice: cabinPrice + extrasPrice,
        status: data.status,
        hasBreakfast,
        isPaid,
        observations: data.observations,
      },
      {
        onSuccess: () => {
          reset();
          setHasBreakfast(false);
          setIsPaid(false);
          onCloseModal?.();
        },
      }
    );
  }

  function onError() {}

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Guest" error={errors?.guestId?.message}>
        <Select
          id="guestId"
          disabled={isCreating}
          options={guests.map((guest) => ({
            value: guest.id,
            label: `${guest.fullName} (${guest.email})`,
          }))}
          {...register("guestId", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <Select
          id="cabinId"
          disabled={isCreating}
          options={cabins.map((cabin) => ({
            value: cabin.id,
            label: `${cabin.name} — up to ${cabin.maxCapacity} guests`,
          }))}
          {...register("cabinId", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isCreating}
          {...register("startDate", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isCreating}
          {...register("endDate", {
            required: "This field is required",
            validate: (value) =>
              new Date(value) > new Date(getValues().startDate) ||
              "End date must be after start date",
          })}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isCreating}
          defaultValue={1}
          {...register("numGuests", {
            required: "This field is required",
            min: { value: 1, message: "There must be at least 1 guest" },
          })}
        />
      </FormRow>

      <FormRow label="Status">
        <Select
          id="status"
          disabled={isCreating}
          defaultValue="unconfirmed"
          options={[
            { value: "unconfirmed", label: "Unconfirmed" },
            { value: "checked-in", label: "Checked in" },
            { value: "checked-out", label: "Checked out" },
          ]}
          {...register("status")}
        />
      </FormRow>

      <FormRow label="Observations">
        <Textarea
          id="observations"
          disabled={isCreating}
          {...register("observations")}
        />
      </FormRow>

      <FormRow>
        <Checkbox
          id="hasBreakfast"
          checked={hasBreakfast}
          onChange={() => setHasBreakfast((v) => !v)}
          disabled={isCreating}
        >
          Guest needs breakfast
        </Checkbox>
      </FormRow>

      <FormRow>
        <Checkbox
          id="isPaid"
          checked={isPaid}
          onChange={() => setIsPaid((v) => !v)}
          disabled={isCreating}
        >
          Booking is already paid
        </Checkbox>
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
