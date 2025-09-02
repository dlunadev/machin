import * as Yup from "yup";

const recovery_password_schema = Yup.object().shape({
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
});

export { recovery_password_schema };
