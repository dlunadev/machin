import * as Yup from "yup";

const confirmation_schema = Yup.object().shape({
  code: Yup.string()
    .min(4, "El código debe tener al menos 4 caracteres")
    .required("El código de confirmación es obligatorio"),
});

export interface ConfirmationFormValues {
  code: string;
}

export { confirmation_schema };
