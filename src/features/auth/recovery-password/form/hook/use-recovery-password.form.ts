
import { useFormik } from "formik";
import { recovery_password_schema, RecoveryPasswordFormValues } from "../schema/recovery-password.schema";

export function useRecoveryPasswordForm(
  onSubmit: (values: RecoveryPasswordFormValues) => void
) {

  const formik = useFormik<RecoveryPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: recovery_password_schema,
    onSubmit,
  });

  return formik;
}