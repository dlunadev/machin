
import { useFormik } from "formik";
import { sign_in_schema, SignInFormValues } from "../schema/sign-in.schema";

export function useSignInForm(
  onSubmit: (values: SignInFormValues) => void
) {

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: sign_in_schema,
    onSubmit,
  });

  return formik;
}