export const baseQueryReport = `
SELECT DISTINCT 
	chem.checklist_id,
	chit.checklist_item_id,
    tpem.tipo_examen_id,
	chit.estado AS estado_item, 
	chem.estado AS esta_activo,
    tpem.nombre AS tipo_examen,
    tpem.estado AS estado_tipo_examen,
    chem.cc_empleado,
    chem.es_requerido,
    chit.observaciones,
    chit.fecha_realizado,
    chit.fecha_vencimiento,
    chit.frecuencia_dias,
    chit.PDF_url,
    
    -- Información del empleado
    emp.Empresa,
    emp.ESTADO AS estado_empleado,
    emp.Nombre,
    emp.[Fecha de ingreso],
    emp.[Fecha de nacimiento],
    emp.Genero,
    emp.[Desc. Cargo],
    emp.[Centro de costos],
    emp.[Grupo empleado],
    emp.[Tipo de contrato],
    emp.[Correo Electronico],
    emp.Ciudad,
    emp.Departamento,
    emp.Pais

FROM SST_LINK.SST_NS.dbo.tipos_examenes tpem

-- JOIN principal: desde tipos de exámenes hacia checklist
INNER JOIN SST_LINK.SST_NS.dbo.checklist_examenes chem 
    ON tpem.tipo_examen_id = chem.tipo_examen_id

-- JOIN hacia items del checklist
LEFT JOIN SST_LINK.SST_NS.dbo.checklist_items chit 
    ON chit.checklist_id = chem.checklist_id

-- JOIN hacia información de empleados
LEFT JOIN (
    -- Subquery de empleados (solo empleados activos de New Stetic)
    SELECT DISTINCT 
        t200.f200_nit,
        
        CASE 
            WHEN c0540_id_cia = 1 THEN 'New Stetic' 
            ELSE 'Temporal' 
        END AS Empresa,
        
        CASE 
            WHEN [w0550_contratos].c0550_ind_estado = 1 THEN 'ACTIVO' 
            ELSE 'INACTIVO'
        END AS ESTADO,
        
        f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2 AS Nombre,
        
        CONVERT(NVARCHAR, [w0550_contratos].c0550_fecha_ingreso, 112) AS [Fecha de ingreso],
        CONVERT(NVARCHAR, c0540_fecha_nacimiento, 112) AS [Fecha de nacimiento],
    
        CASE 
            WHEN w0540_empleados.c0540_ind_sexo = '0' THEN 'Hombre' 
            ELSE 'Mujer' 
        END AS Genero,
        
        CARGOS.C0763_DESCRIPCION AS "Desc. Cargo",
        cco.f284_descripcion AS [Centro de costos],
        
        CASE 
            WHEN [c0510_descripcion] IN ('EXPORTACIONES', 'VENTAS NACIONALES') THEN 'VENTAS' 
            ELSE [c0510_descripcion] 
        END AS [Grupo empleado],
        
        T18.c0006_descripcion AS [Tipo de contrato],
        [f015_email] AS [Correo Electronico],
        f013_descripcion AS Ciudad,
        [f012_descripcion] AS Departamento,
        [f011_descripcion] AS Pais

    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid
        
        LEFT JOIN unoee.dbo.t284_co_ccosto cco  	
            ON cco.f284_rowid = [w0550_contratos].c0550_rowid_ccosto
        
        LEFT JOIN unoee.dbo.W0763_GH01_CARGOS CARGOS 
            ON C0550_ROWID_CARGO = CARGOS.C0763_ROWID
        
        LEFT JOIN unoee.dbo.[w0510_grupos_empleados] AS grupo_emp 
            ON grupo_emp.[c0510_rowid] = [w0550_contratos].c0550_rowid_grupo_empleados

        LEFT JOIN unoee.dbo.t015_mm_contactos 
            ON t015_mm_contactos.[f015_rowid] = t200.[f200_rowid_contacto]
        
        LEFT OUTER JOIN Unoee.dbo.t011_mm_paises AS C011 
            ON f015_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t012_mm_deptos AS C012 
            ON f015_id_depto = C012.f012_id 
            AND C012.f012_id_pais = C011.f011_id 
        
        LEFT OUTER JOIN Unoee.dbo.t013_mm_ciudades AS T013 
            ON f015_id_ciudad = T013.f013_id 
            AND T013.f013_id_depto = C012.f012_id 
            AND T013.f013_id_pais = C011.f011_id
        
        LEFT OUTER JOIN unoee.dbo.w0006_tipos AS T18 
            ON T18.c0006_id_tipo = 'c0550_ind_termino' 
            AND T18.c0006_id_lenguaje = 1 
            AND T18.c0006_valor = [w0550_contratos].c0550_ind_termino_contrato
        
) AS emp ON emp.f200_nit = chem.cc_empleado

WHERE chit.estado NOT IN ('Eliminado')
`;

export const totalRegisters = `
SELECT COUNT(*) AS totalRegisters FROM SST_LINK.SST_NS.dbo.tipos_examenes tpem

INNER JOIN SST_LINK.SST_NS.dbo.checklist_examenes chem ON tpem.tipo_examen_id = chem.tipo_examen_id

LEFT JOIN SST_LINK.SST_NS.dbo.checklist_items chit ON chit.checklist_id = chem.checklist_id

LEFT JOIN (
    SELECT DISTINCT 
        t200.f200_nit,
        
        CASE 
            WHEN c0540_id_cia = 1 THEN 'New Stetic' 
            ELSE 'Temporal' 
        END AS Empresa,
        
        CASE 
            WHEN [w0550_contratos].c0550_ind_estado = 1 THEN 'ACTIVO' 
            ELSE 'INACTIVO'
        END AS ESTADO

    FROM unoee.dbo.t200_mm_terceros AS t200 
        INNER JOIN unoee.dbo.w0540_empleados
            ON w0540_empleados.c0540_id_cia = t200.f200_id_cia 
            AND t200.f200_rowid = w0540_empleados.c0540_rowid_tercero
        
        INNER JOIN unoee.dbo.[w0550_contratos] 
            ON [w0550_contratos].[c0550_rowid_tercero] = t200.f200_rowid
        
) AS emp ON emp.f200_nit = chem.cc_empleado

WHERE chit.estado NOT IN ('Eliminado')
`;