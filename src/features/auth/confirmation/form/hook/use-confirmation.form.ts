
import { useFormik } from "formik";
import { confirmation_schema, ConfirmationFormValues } from "../schema/confirmation.schema";

export function useConfirmationForm(
  onSubmit: (values: ConfirmationFormValues) => void
) {

  const formik = useFormik<ConfirmationFormValues>({
    initialValues: {
      code: "",
    },
    validationSchema: confirmation_schema,
    onSubmit,
  });

  return formik;
}
