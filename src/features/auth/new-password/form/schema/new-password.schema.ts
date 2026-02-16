import * as Yup from "yup";

const new_password_schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Las contraseñas no coinciden")
    .required("La confirmación de contraseña es obligatoria"),
});

export interface NewPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export { new_password_schema };
