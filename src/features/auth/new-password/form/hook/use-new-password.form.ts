
import { useFormik } from "formik";
import { new_password_schema, NewPasswordFormValues } from "../schema/new-password.schema";

export function useNewPasswordForm(
  onSubmit: (values: NewPasswordFormValues) => void
) {

  const formik = useFormik<NewPasswordFormValues>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: new_password_schema,
    onSubmit,
  });

  return formik;
}
