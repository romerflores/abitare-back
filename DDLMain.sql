--ENUMS
CREATE TYPE enum_disponibilidad_area AS ENUM ('HABILITADO', 'DESHABILITADO', 'REPARACION');
CREATE TYPE enum_estados AS ENUM ('OCUPADO','DISPONIBLE');
CREATE TYPE enum_tipo_vehiculo AS ENUM ('AUTOMOVIL', 'MOTOCICLETA');
CREATE TYPE enum_estado_ticket AS ENUM ('PENDIENTE', 'EN PROCESO', 'RESUELTO');

--Usuarios
CREATE TABLE administrador(
	id_administrador INT PRIMARY KEY, --Se genera en el backend, tiene 8 dígitos
	nombre VARCHAR(50) NOT NULL,
	paterno VARCHAR(50) NOT NULL,
	materno VARCHAR(50) NOT NULL,
	ci INT UNIQUE NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	correo VARCHAR(100) UNIQUE NOT NULL, --Es unico, ya que es otra forma de reconocer al usuario
	clave_hasheada VARCHAR(100) NOT NULL,
	autenticacion_mfa BOOLEAN DEFAULT TRUE NOT NULL, --Es TRUE, ya que se le envia un codigo OTP a su correo por lo que la autenticacion esta activa
	fecha_creacion TIMESTAMP NOT NULL,
	fecha_actu_datos TIMESTAMP NOT NULL, --Se modifica al editar sus datos
	fecha_cambio_clave TIMESTAMP NOT NULL --Se modifica la primera vez o al pedir el cambio de contraseña
)

CREATE TABLE area_comun(
	id_area SERIAL PRIMARY KEY, --Autoincremental
	nombre VARCHAR(100) NOT NULL,
	descripcion TEXT NOT NULL,
	disponibilidad enum_disponibilidad_area NOT NULL,
	tipo VARCHAR(30) NOT NULL, --Podria utilizarse un ENUM
	dimension DECIMAL(10,2),
	hora_apertura TIME NOT NULL,
	hora_cierre TIME NOT NULL,
	costo_hora DECIMAL(10,2) NOT NULL
	acuerdo_uso TEXT
)

CREATE TABLE cambio_contrasenia(
	id_registro SERIAL PRIMARY KEY,
	usuario VARCHAR(100) NOT NULL,
	fecha_cambio TIMESTAMP NOT NULL,
	codigo_email INT NOT NULL,
	estado_clave BOOLEAN NOT NULL DEFAULT TRUE
)

CREATE TABLE contrato(
	id_contrato SERIAL PRIMARY KEY,
	tipo_dpto VARCHAR(50) NOT NULL,
	fecha_inicio DATE NOT NULL,
	fecha_fin DATE NOT NULL,
	residente INT REFERENCES residente (id_residente),
	departamento VARCHAR(20) REFERENCES departamento (id_departamento),
)

CREATE TABLE departamento(
	id_departamento VARCHAR(20) PRIMARY KEY,
	piso INT NOT NULL,
	numero INT NOT NULL,
	estado enum_estados NOT NULL
)

CREATE TABLE pago_dpto(
	id_pago SERIAL PRIMARY KEY,
	contrato INT REFERENCES contrato (id_contrato),
	costo DECIMAL(10,2) NOT NULL,
	fecha_generado DATE NOT NULL,
	fecha_max_pago DATE NOT NULL,
	fecha_pago TIMESTAMP
)

CREATE TABLE estacionamiento(
	id_parqueo VARCHAR(10) PRIMARY KEY, --Generado a partir de la zona y la posicion
	zona VARCHAR(10) NOT NULL,
	posicion VARCHAR(10) NOT NULL,
	tipo_vehiculo enum_tipo_vehiculo NOT NULL,
	disponibilidad enum_estados NOT NULL,
	dimension DECIMAL (10,2),
	fecha_cambio_disponibilidad TIMESTAMP--Se cambia en el momento de ingresar o salir un nuevo vehiculo
)

CREATE TABLE inicio_sesion(
	id_inicio SERIAL PRIMARY KEY,
	correo_residente VARCHAR(255) NOT NULL, --error en el nombre, debia ser correo solamente
	fecha_inicio TIMESTAMP NOT NULL,
	codigo_inicio INT NOT NULL
)

CREATE TABLE personal(
	id_personal INT PRIMARY KEY, --Se genera en el backend, tiene 8 dígitos
	nombres VARCHAR(50) NOT NULL,
	paterno VARCHAR(50) NOT NULL,
	materno VARCHAR(50) NOT NULL,
	ci INT UNIQUE NOT NULL,
	celular INT NOT NULL,
	salario DECIMAL(10,2) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL, --Es unico, ya que es otra forma de reconocer al usuario
	clave_hasheada VARCHAR(100),
	estado_disponible BOOLEAN DEFAULT TRUE NOT NULL, --Es TRUE, ya que recien fue contratado
	fecha_contratacion TIMESTAMP NOT NULL,
	hora_entrada TIME NOT NULL,
	hora_salida TIME NOT NULL,
	fecha_actualizacion TIMESTAMP, --Se llena ante cualquier dato actualizado
	estado_activo VARCHAR(20) NOT NULL
)

CREATE TABLE personal_mantenimiento (
    id_personal INTEGER REFERENCES personal(id_personal) ON DELETE CASCADE,
	id_mantenimiento INTEGER REFERENCES tipo_mantenimiento(id_mantenimiento) ON DELETE CASCADE,
    PRIMARY KEY (id_personal, id_mantenimiento)
);

CREATE TABLE prioridad (
    id_prioridad SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- Ej: 'Urgente', 'Alta', 'Normal'
    nivel_orden INTEGER UNIQUE NOT NULL, -- 1, 2, 3... (para facilitar la clasificación)
    tiempo_respuesta_esperado INTERVAL -- Ej: '2 hours', '1 day'
);

CREATE TABLE registro_estacionamiento(
	id_registro SERIAL PRIMARY KEY, --Importante para mostrar al usuario que ticket tiene
	placa VARCHAR(20) REFERENCES vehiculo (placa),
	parqueo VARCHAR(10) REFERENCES estacionamiento (id_parqueo),
	fecha_ingreso TIMESTAMP NOT NULL,
	fecha_salida TIMESTAMP --Es nulo porque el ticket aùn no finaliza
) 

CREATE TABLE registro_visita(
	id_registro SERIAL PRIMARY KEY, --Se genera automaticamente 1,2,3,...,n
	departamento VARCHAR(20) REFERENCES departamento(id_departamento),
	ci_visitante INT NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	paterno VARCHAR(50) NOT NULL,
	materno VARCHAR(50) NOT NULL,
	descripcion TEXT NOT NULL, --Razon por la cual se esta haciendo la visita
	fecha_entrada TIMESTAMP NOT NULL,
	fecha_salida TIMESTAMP --Fecha y hora en la cual sale el visitante
)

CREATE TABLE reserva_area_comun(
	id_reserva SERIAL PRIMARY KEY,
	residente INT REFERENCES residente (id_residente),
	area INT REFERENCES area_comun (id_area),
	fecha DATE NOT NULL,  --Fecha de la reservacion
	hora_inicio TIME NOT NULL,
	hora_fin TIME NOT NULL,
	fecha_reserva TIMESTAMP NOT NULL,  --Fecha en la cual fue HECHA la reserva
	costo_total DECIMAL(10,2)
)

CREATE TABLE pago_reserva_area_comun(
	id_pago SERIAL PRIMARY KEY,
	reserva INT REFERENCES reserva_area_comun (id_reserva),
	costo_total DECIMAL (10,2) NOT NULL,
	estado_pago BOOLEAN TRUE DEFAULT NOT NULL,
	fecha_pago TIMESTAMP
)

CREATE TABLE residente(
	id_residente INT PRIMARY KEY, --Se genera en el backend, tiene 8 dígitos
	id_departamento VARCHAR(20) REFERENCES departamento (id_departamento),
	nombre VARCHAR(50) NOT NULL,
	paterno VARCHAR(50) NOT NULL,
	materno VARCHAR(50) NOT NULL,
	ci INT UNIQUE NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	correo VARCHAR(100) UNIQUE NOT NULL, --Es unico, ya que es otra forma de reconocer al usuario
	clave_hasheada VARCHAR(100) NOT NULL,
	autenticacion_mfa BOOLEAN DEFAULT TRUE NOT NULL, --Es TRUE, ya que se le envia un codigo OTP a su correo por lo que la autenticacion esta activa
	fecha_creacion TIMESTAMP NOT NULL,
	fecha_actu_datos TIMESTAMP NOT NULL, --Se modifica al editar sus datos
	fecha_cambio_clave TIMESTAMP NOT NULL, --Se modifica la primera vez o al pedir el cambio de contraseña
	tipo_residente VARCHAR(50) NOT NULL /* tipo_residente INTEGER REFERENCES roles (id_rol) en caso de añadir roles */  
)

CREATE TABLE ticket_archivo (
    id_archivo SERIAL PRIMARY KEY,
    id_ticket INTEGER REFERENCES ticket_residente(id_ticket) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_mime VARCHAR(100), -- Ej: 'image/jpeg', 'video/mp4'
    fecha_subida TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE ticket_historial_estado(
	id_historial SERIAL PRIMARY KEY,
	ticket INT REFERENCES ticket_residente (id_ticket) NOT NULL,
	estado_anterior TEXT,
	estado_nuevo TEXT,
	fecha_cambio TIMESTAMP NOT NULL,
	tecnico INT REFERENCES personal(id_personal) NOT NULL,
	notas_extra TEXT
)

CREATE TABLE ticket_residente (
    id_ticket SERIAL PRIMARY KEY ,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
	mantenimiento INTEGER REFERENCES tipo_mantenimiento(id_mantenimiento),
	
    -- Origen y Ubicación
    residente INTEGER REFERENCES residente (id_residente),
    ubicacion_detalle VARCHAR(255) NOT NULL, 
    
	-- Gestión y Estado
    prioridad INTEGER REFERENCES prioridad(id_prioridad) NOT NULL, 
    estado enum_estado_ticket DEFAULT 'PENDIENTE', 
    tecnico_asignado INTEGER REFERENCES personal(id_personal), -- Técnico responsable
    fecha_asignacion TIMESTAMP WITHOUT TIME ZONE,
    
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITHOUT TIME ZONE,
    
    resumen_trabajo TEXT, 
    firma_residente_valida BOOLEAN DEFAULT FALSE 
);

CREATE TABLE pago_ticket_mantenimiento(
	id_pago SERIAL PRIMARY KEY,
	ticket INT REFERENCES ticket_residente (id_ticket),
	costo_total DECIMAL (10,2) NOT NULL,
	estado_pago BOOLEAN TRUE DEFAULT NOT NULL,
	fecha_pago TIMESTAMP
)

CREATE TABLE tipo_mantenimiento (
    id_mantenimiento SERIAL PRIMARY KEY,
    tipo VARCHAR(100) UNIQUE NOT NULL, -- Ej: 'Fontanería', 'Electricidad', 'Redes'
    descripcion TEXT,
    esta_activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE vehiculo(
	placa VARCHAR(20) PRIMARY KEY,
	residente INT REFERENCES residente(id_residente),
	modelo VARCHAR(50) NOT NULL,
	color VARCHAR(20) NOT NULL,
	marca VARCHAR(20) NOT NULL,
	tipo_vehiculo enum_tipo_vehiculo NOT NULL
)

CREATE TABLE servicio (
	id_servicio SERIAL PRIMARY KEY,
	nombre_servicio VARCHAR(255) NOT NULL,
	unidad_medida VARCHAR(255) NOT NULL,
	simbolo_medida VARCHAR(10) NOT NULL,
	costo_por_unidad DECIMAL(10,2) NOT NULL
)

CREATE TABLE reg_dpto_servicio(
	id_registro SERIAL PRIMARY KEY,
	departamento VARCHAR REFERENCES departamento (id_departamento),
	servicio INT REFERENCES servicio (id_servicio),
	fecha_registro DATE NOT NULL,
	medida_total DECIMAL (10,2) NOT NULL,
	costo_total DECIMAL (10,2) NOT NULL
)
