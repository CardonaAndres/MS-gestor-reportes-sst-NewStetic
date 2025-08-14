export const baseQueryReport = `
SELECT 
    chit.checklist_id, 
    chit.checklist_item_id, 
    tpem.tipo_examen_id,
    chit.estado AS estado_item, 
    chem.estado AS esta_activo,
    tpem.nombre AS tipo_examen,
    tpem.estado AS estado_tipo_examen,
    chit.observaciones, 
    chit.fecha_realizado, 
    chit.fecha_vencimiento, 
    chit.frecuencia_dias, 
    chit.PDF_url, 
    chem.cc_empleado,
    chem.es_requerido
FROM checklist_items chit 
INNER JOIN checklist_examenes chem 
    ON chit.checklist_id = chem.checklist_id 
INNER JOIN tipos_examenes tpem 
    ON tpem.tipo_examen_id = chem.tipo_examen_id
WHERE chit.estado NOT IN ('Eliminado') 
`;