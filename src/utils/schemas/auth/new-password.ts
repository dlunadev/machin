import * as Yup from "yup";

export const new_password_schema = Yup.object().shape({
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  new_password: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("La confirmación de contraseña es requerida"),
});
