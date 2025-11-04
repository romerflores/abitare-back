import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Administracion de edificio multifamiliar",
      version: "1.0.0",
      description: "Documentacion para la aplicacion. Para toda acción que haga, debe iniciar sesión",
      contact: {
        name: "Abitare",
      },
      servers: [
        {
          url: "http://localhost:10000",
          description: "Servidor local",
        },
      ],
    },
    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con los usuarios'
      }, {
        name: 'Administrador',
        description: 'Operaciones que realiza el administrador'
      }
      , {
        name: 'Area-comun',
        description: 'Gestion de areas comunes por parte del usuario y administrador'
      }
    , {
        name: 'Area-comun-administrador',
        description: 'Gestion de areas comunes por parte del administrador'
      }, {
      name: 'Area-comun-usuario',
        description: 'Gestion de reservas que hace el usuario'
      }
    ]
  },
  apis: ["./routes/usuarioRoutes/*.js", "./routes/areasComunesRoutes/*.js", "./routes/estacionamientoRoutes/*.js"],
};

export const specs = swaggerJSDoc(options);
