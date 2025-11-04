CREATE OR REPLACE PROCEDURE proc_reservar_area (
	residente_in INT,
	area_reserva_in INT,
	fecha_in DATE,
	inicio_reserva_in TIME,
	fin_reserva_in TIME
)
AS $$
DECLARE 
costo_reserva_in DECIMAL(10,2);
costo_reserva DECIMAL(10,2);
intervalo NUMERIC; -- Corregido a NUMERIC para precisión
BEGIN
    SELECT costo_por_hora INTO costo_reserva_in FROM area_comun WHERE id_area = area_reserva_in;
    
    -- Se corrigió la sintaxis de la división del INTERVAL
    intervalo := EXTRACT(EPOCH FROM (fin_reserva_in - inicio_reserva_in)) / 60.0; 
    
    -- El costo_reserva es el costo por minuto * número de minutos
    costo_reserva := (intervalo * (costo_reserva_in / 60.0)); 
    
    -- Se corrigió el nombre de la columna a 'costo_total'
    INSERT INTO reserva_area_comun (residente, area, fecha, hora_inicio, hora_fin, fecha_reserva, costo_total) 
        VALUES (residente_in, area_reserva_in, fecha_in, inicio_reserva_in, fin_reserva_in, NOW(), costo_reserva);

END;
$$ LANGUAGE plpgsql;

--Cambiar por los nuevos nombres de los campos
CREATE OR REPLACE PROCEDURE proc_editar_reserva_area (
	id_reserva_in INT,
	fecha_in DATE,
	inicio_reserva_in TIME,
	fin_reserva_in TIME
)
AS $$
DECLARE 
costo_reserva_in DECIMAL(10,2);
costo_reserva DECIMAL(10,2);
intervalo NUMERIC; -- Corregido a NUMERIC para precisión
area_reserva_in INT;
BEGIN
	SELECT id_area INTO area_reserva_in FROM reserva_area_comun WHERE id_reserva = id_reserva_in;
    SELECT costo_por_hora INTO costo_reserva_in FROM area_comun WHERE id_area = area_reserva_in;
    
    -- Se corrigió la sintaxis de la división del INTERVAL
    intervalo := EXTRACT(EPOCH FROM (fin_reserva_in - inicio_reserva_in)) / 60.0; 
    
    -- El costo_reserva es el costo por minuto * número de minutos
    costo_reserva := (intervalo * (costo_reserva_in / 60.0)); 
    
    -- Se corrigió el nombre de la columna a 'costo_total'
	UPDATE reserva_area_comun SET fecha = fecha_in, hora_inicio = inicio_reserva_in, hora_fin = fin_reserva_in, fecha_reserva = NOW()
	 WHERE id_reserva = id_reserva_in;
	 
END;
$$ LANGUAGE plpgsql;

--Cambiar por los nuevos nombres de los campos
CREATE OR REPLACE PROCEDURE proc_editar_reserva_area (
	id_reserva_in INT,
	fecha_in DATE,
	inicio_reserva_in TIME,
	fin_reserva_in TIME
)
AS $$
DECLARE 
costo_reserva_in DECIMAL(10,2);
costo_reserva DECIMAL(10,2);
intervalo NUMERIC; -- Corregido a NUMERIC para precisión
area_reserva_in INT;
BEGIN
	SELECT id_area INTO area_reserva_in FROM reserva_area_comun WHERE id_reserva = id_reserva_in;
    SELECT costo_por_hora INTO costo_reserva_in FROM area_comun WHERE id_area = area_reserva_in;
    
    -- Se corrigió la sintaxis de la división del INTERVAL
    intervalo := EXTRACT(EPOCH FROM (fin_reserva_in - inicio_reserva_in)) / 60.0; 
    
    -- El costo_reserva es el costo por minuto * número de minutos
    costo_reserva := (intervalo * (costo_reserva_in / 60.0)); 
    
    -- Se corrigió el nombre de la columna a 'costo_total'
	UPDATE reserva_area_comun SET fecha = fecha_in, hora_inicio = inicio_reserva_in, hora_fin = fin_reserva_in, fecha_reserva = NOW(), costo = costo_reserva
	 WHERE id_reserva = id_reserva_in;
	 
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION func_verificar_reserva(
    area_id_param INT,             -- Nuevo parámetro para filtrar por área
    fecha_param DATE,
    hora_inicio_param TIME,
    hora_fin_param TIME
)
RETURNS TABLE (
    fecha_reserva DATE,
    inicio_existente TIME,
    fin_existente TIME
) 
AS $$
BEGIN
    RETURN QUERY
    -- La consulta verifica si el nuevo rango de tiempo se solapa con alguno existente
    SELECT 
        r.fecha, 
        r.hora_inicio, 
        r.hora_fin 
    FROM 
        reserva_area_comun r 
    WHERE 
        r.area = area_id_param -- Se verifica que sea la misma área
        AND r.fecha = fecha_param
        AND (
            -- Condición de solapamiento: verifica si el fin de A es después del inicio de B Y el inicio de A es antes del fin de B
            (hora_fin_param > r.hora_inicio AND hora_inicio_param < r.hora_fin)
        ); 
        
    -- Si se devuelve alguna fila, significa que hay un conflicto.
END;
$$ LANGUAGE plpgsql;

--DTL de mantenimiento

CREATE OR REPLACE FUNCTION registrar_incidente(
	titulo_in VARCHAR(255),
	descripcion_in TEXT,
	mantenimiento_in VARCHAR(30),
	residente_in INT,
	ubicacion_in VARCHAR(255),
	prioridad_in VARCHAR(30)
)
RETURNS INTEGER
AS $$
DECLARE
	id_ticket_generado INTEGER;
	prioridad_key INTEGER;
	mantenimiento_key INTEGER;
BEGIN
	--Dar el ID correspondiente a la prioridad en formato texto
	SELECT id_prioridad INTO prioridad_key FROM prioridad WHERE nombre = prioridad_in;

	--Dar el ID correspondiente al mantenimiento en formato texto
	SELECT id_mantenimiento INTO mantenimiento_key FROM tipo_mantenimiento WHERE tipo = mantenimiento_in; 
	
	INSERT INTO ticket_residente (titulo, descripcion, mantenimiento, residente, ubicacion_detalle, prioridad)
	 VALUES (titulo_in, descripcion_in, mantenimiento_key, residente_in, ubicacion_in, prioridad_key)
	RETURNING id_ticket INTO id_ticket_generado;

	RETURN id_ticket_generado;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE registrar_incidente_archivos(
	ticket_in INT,
	nombre_archivo_in VARCHAR(255),
	tipo_mime_int VARCHAR(100)
)
AS $$
BEGIN
	INSERT INTO ticket_archivo (id_ticket, nombre_archivo, tipo_mime) 
		VALUES (ticket_in, nombre_archivo_in, tipo_mime_int);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION func_obtener_datos_incidente(
	ticket_in INT
)
RETURNS TABLE (
    titulo_out VARCHAR,
    descripcion_out TEXT,
    ubicacion_out VARCHAR,
    prioridad_nombre_out VARCHAR, 
    estado_out enum_estado_ticket,
    nombres_out VARCHAR,
    paterno_out VARCHAR,
    materno_out VARCHAR,
    fecha_creacion_out TIMESTAMP,
    fecha_cierre_out TIMESTAMP,
    fecha_asignacion_out TIMESTAMP,
    resumen_out TEXT,
    firma_valida_out BOOLEAN
)
AS $$
BEGIN
	RETURN QUERY
	SELECT 
        tr.titulo, 
        tr.descripcion, 
        tr.ubicacion_detalle, 
        p.nombre, 
        tr.estado, 
        pe.nombres, 
        pe.paterno, 
        pe.materno, 
        tr.fecha_creacion, 
        tr.fecha_cierre, 
        tr.fecha_asignacion, 
        tr.resumen_trabajo, 
        tr.firma_residente_valida 
	FROM 
        ticket_residente tr 
	JOIN 
        prioridad p ON tr.prioridad = p.id_prioridad
	LEFT JOIN 
        personal pe ON tr.tecnico_asignado = pe.id_personal
	WHERE 
        tr.id_ticket = ticket_in;
        
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION func_obtener_incidentes(
	residente_in INTEGER
)
RETURNS TABLE (
	ticket_out INTEGER,
    titulo_out VARCHAR,
    fecha_creacion_out TIMESTAMP,
    prioridad_nombre_out VARCHAR,
    estado_out enum_estado_ticket,
    nombres_out VARCHAR,
    paterno_out VARCHAR,
    materno_out VARCHAR
)
AS $$
BEGIN
	RETURN QUERY
	SELECT 
		tr.id_ticket,
        tr.titulo, 
		tr.fecha_creacion,
        p.nombre, 
        tr.estado, 
        pe.nombres, 
        pe.paterno, 
        pe.materno 
	FROM 
        ticket_residente tr 
	JOIN 
        prioridad p ON tr.prioridad = p.id_prioridad
	LEFT JOIN 
        personal pe ON tr.tecnico_asignado = pe.id_personal
	WHERE tr.residente = residente_in
	ORDER BY tr.id_ticket;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE proc_asignar_incidente_tecnico(
	tecnico_in INTEGER,
	ticket_in INTEGER
)
AS $$
BEGIN
	INSERT INTO ticket_registro_trabajo (id_ticket, id_personal, fecha_asignacion) 
		VALUES (ticket_in, tecnico_in, NOW());
	UPDATE ticket_residente SET tecnico_asignado = tecnico_in, fecha_asignacion = NOW() 
		WHERE id_ticket = ticket_in;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM ticket_residente tr
JOIN residente r ON tr.residente = r.id_residente  



CREATE OR REPLACE FUNCTION func_obtener_incidentes_por_tecnico(
	tecnico_in INT
)
RETURNS TABLE(
	ticket_out INT,
	titulo_out VARCHAR,
	fecha_creacion_out TIMESTAMP,
	prioridad_nombre_out VARCHAR,
	estado_out enum_estado_ticket,
	nombres_out VARCHAR,
	paterno_out VARCHAR,
	materno_out VARCHAR
)
AS $$
BEGIN
RETURN QUERY
	SELECT 
	id_ticket, titulo, tr.fecha_creacion, p.nombre, tr.estado, r.nombre, r.paterno, r.materno
	FROM 
	ticket_residente tr 
	JOIN residente r ON tr.residente = r.id_residente
	JOIN prioridad p ON tr.prioridad = p.id_prioridad
	WHERE tr.tecnico_asignado = tecnico_in
	ORDER BY tr.prioridad;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION func_obtener_incidentes_por_tecnico;
SELECT * FROM func_obtener_incidentes_por_tecnico(1);



CREATE OR REPLACE PROCEDURE registrar_incidente_archivos(
	ticket_in INT,
	nombre_archivo_in VARCHAR(255),
	tipo_mime_int VARCHAR(100)
)
AS $$
BEGIN
	INSERT INTO ticket_archivo (id_ticket, nombre_archivo, tipo_mime) 
		VALUES (ticket_in, nombre_archivo_in, tipo_mime_int);
END;
$$ LANGUAGE plpgsql;








CREATE OR REPLACE FUNCTION func_obtener_datos_incidente_tecnico(
	ticket_in INT
)
RETURNS TABLE (
    titulo_out VARCHAR,
    descripcion_out TEXT,
    ubicacion_out VARCHAR,
    prioridad_nombre_out VARCHAR, 
    nombres_out VARCHAR,
    paterno_out VARCHAR,
    materno_out VARCHAR,
	celular_out INTEGER,
	departamento_out VARCHAR,
    fecha_creacion_out TIMESTAMP,
    fecha_asignacion_out TIMESTAMP,
    firma_valida_out BOOLEAN
)
AS $$
BEGIN
	RETURN QUERY
	SELECT 
        tr.titulo, 
        tr.descripcion, 
        tr.ubicacion_detalle, 
        p.nombre,  
        r.nombre, 
        r.paterno, 
        r.materno,
		r.celular, 
		r.id_departamento,
        tr.fecha_creacion,  
        tr.fecha_asignacion, 
        tr.firma_residente_valida 
	FROM 
        ticket_residente tr 
	JOIN 
        prioridad p ON tr.prioridad = p.id_prioridad
	LEFT JOIN 
        residente r ON tr.residente = r.id_residente
	WHERE 
        tr.id_ticket = ticket_in;
        
END;
$$ LANGUAGE plpgsql;

SELECT * FROM ticket_residente

--Admin mantenimiento/incidente

DROP FUNCTION func_obtener_incidentes_id_admin
CREATE OR REPLACE FUNCTION func_obtener_incidentes_id_admin(
	ticket_in INT
)
RETURNS TABLE(
	ticket_out INT, 
	titulo_out VARCHAR, 
	descripcion_out TEXT,
	ubicacion_out VARCHAR,
	nombre_out VARCHAR, 
	estado_out enum_estado_ticket, 
	fecha_asignacion_out TIMESTAMP, 
	fecha_creacion_out TIMESTAMP, 
	fecha_cierre_out TIMESTAMP,
	nombre_residente_out VARCHAR, 
	paterno_residente_out VARCHAR, 
	materno_residente_out VARCHAR, 
	celular_residente_out INT, 
	ci_residente_out VARCHAR, 
	correo_residente_out VARCHAR, 
	nombre_personal_out VARCHAR, 
	paterno_personal_out VARCHAR, 
	materno_personal_out VARCHAR, 
	celular_personal_out INT, 
	email_personal_out VARCHAR, 
	ci_personal_out INT,
	mantenimiento_out VARCHAR
)
AS $$
BEGIN
RETURN QUERY
	SELECT 
		tr.id_ticket, 
		tr.titulo, 
		tr.descripcion,
		tr.ubicacion_detalle,
		pr.nombre, 
		tr.estado, 
		tr.fecha_asignacion, 
		tr.fecha_creacion, 
		tr.fecha_cierre,
		r.nombre, 
		r.paterno, 
		r.materno, 
		r.celular, 
		r.ci, 
		r.correo, 
		p.nombres, 
		p.paterno, 
		p.materno, 
		p.celular, 
		p.email, 
		p.ci,
		tm.tipo
	FROM ticket_residente tr
	LEFT JOIN residente r ON tr.residente = r.id_residente
	LEFT JOIN personal p ON tr.tecnico_asignado = p.id_personal
	LEFT JOIN prioridad pr ON tr.prioridad = pr.id_prioridad
	LEFT JOIN tipo_mantenimiento tm ON tr.mantenimiento = tm.id_mantenimiento 
	WHERE id_ticket = ticket_in;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE proc_asignar_tecnico (
	ticket_in INT,
	nombre_personal_in VARCHAR,
	paterno_personal_in VARCHAR,
	materno_personal_in VARCHAR
)
AS $$
DECLARE 
	id_personal_in INT;
	mantenimiento_in INT;
BEGIN
	SELECT pm.id_personal, pm.id_mantenimiento INTO id_personal_in, mantenimiento_in 
	FROM personal p 
	JOIN personal_mantenimiento pm ON p.id_personal = pm.id_personal
	WHERE nombres = nombre_personal_in AND paterno = paterno_personal_in AND materno = materno_personal_in;
	
	UPDATE ticket_residente SET fecha_asignacion = NOW(), tecnico_asignado = id_personal_in WHERE id_ticket = ticket_in AND tecnico_asignado IS NULL AND mantenimiento = mantenimiento_in ;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION func_obtener_incidentes_tabla_admin ()
RETURNS TABLE(
	ticket_out INT,
	titulo_out VARCHAR,
	prioridad_out VARCHAR,
	estado_out enum_estado_ticket,
	fecha_creacion TIMESTAMP,
	nombre_residente_out VARCHAR,
	paterno_residente_out VARCHAR,
	materno_residente_out VARCHAR,
	nombre_tecnico_out VARCHAR,
	paterno_tecnico_out VARCHAR,
	materno_tecnico_out VARCHAR
)
AS $$
BEGIN
RETURN QUERY
	SELECT tr.id_ticket, tr.titulo, pr.nombre, tr.estado, tr.fecha_creacion, r.nombre, r.paterno, r.materno, p.nombres, p.paterno, p.materno 
		FROM ticket_residente tr
		LEFT JOIN residente r ON tr.residente = r.id_residente
		LEFT JOIN personal p ON tr.tecnico_asignado = p.id_personal
		LEFT JOIN prioridad pr ON tr.prioridad = pr.id_prioridad
		ORDER BY fecha_creacion DESC;
END;
$$ LANGUAGE plpgsql;

DROP PROCEDURE proc_registrar_servicio 

CREATE OR REPLACE PROCEDURE proc_registrar_servicio (
	dpto_in VARCHAR,
	servicio_nombre_in VARCHAR, 
	fecha_in DATE,
	medida_in DECIMAL
)
AS $$
DECLARE
	costo_total DECIMAL(10,2);
	costo_servicio_aux DECIMAL (10,2);
	servicio_aux INT;
BEGIN
	SELECT costo_por_unidad, id_servicio INTO costo_servicio_aux, servicio_aux 
	FROM servicio
	WHERE nombre_servicio = servicio_nombre_in;

    IF servicio_aux IS NULL THEN
        RAISE EXCEPTION 'El servicio "%" no es válido. No se puede registrar.', servicio_nombre_in;
    END IF;

    costo_total := (medida_in * costo_servicio_aux);
    
	INSERT INTO reg_dpto_servicio (departamento, servicio, fecha_registro, medida_total, costo_total)
	VALUES (dpto_in, servicio_aux, fecha_in, medida_in, costo_total);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION func_obtener_registros_consumo(
	dpto_in VARCHAR
)
RETURNS TABLE(
	nombre_out VARCHAR,
	simbolo_out VARCHAR,
	fecha_out DATE,
	medida_out DECIMAL,
	total_out DECIMAL
)
AS $$
BEGIN
	RETURN QUERY
	SELECT s.nombre_servicio, s.simbolo_medida, r.fecha_registro, r.medida_total, r.costo_total
	FROM servicio s
	LEFT JOIN reg_dpto_servicio r ON s.id_servicio = r.servicio
	WHERE r.departamento = dpto_in;
END;
$$ LANGUAGE plpgsql;

