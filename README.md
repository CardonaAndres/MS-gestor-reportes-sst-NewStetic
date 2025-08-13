# 📊 MS Reports Manager | New Stetic SST

**Microservicio para la gestión integral de reportes** dentro del sistema SST (*Seguridad y Salud en el Trabajo*) de la empresa **New Stetic**.
Forma parte de la arquitectura de microservicios que soporta el ecosistema SST, cumpliendo con requisitos legales, normativos y de trazabilidad establecidos para el sector.

---

## 🚀 Descripción

El **MS-Reports-Manager-SST** es el núcleo de **gestión y generación de reportes** dentro del ecosistema SST de **New Stetic**.
Su propósito es centralizar la información, facilitar el análisis histórico y en tiempo real, y garantizar la integridad de los datos para la toma de decisiones corporativas.

Está desarrollado con **NestJS** y aplica las buenas prácticas definidas en la documentación técnica del proyecto SS.

**🚀 Funcionalidades:**

* **Gestión integral de reportes:** creación, edición, consulta y eliminación de reportes en múltiples dominios funcionales:

  * Checklists de inspecciones.
  * Accidentalidad e incidentes.
  * Vigilancia epidemiológica.
  * Equipos de protección personal (EPP) y ergonomía.
  * Higiene ocupacional y reportes ambientales.
  * Otros reportes estratégicos definidos por el área SST.
* **Generación de reportes personalizados:** filtrados por fecha, área, tipo de evento, responsable o estado.
* **Consolidación de datos históricos:** almacenamiento seguro para cumplir con requisitos legales de conservación (hasta 20 años), facilitando análisis longitudinal.
* **Visualización y exportación:** datos listos para presentación y exportación en formatos como PDF y Excel.
* **Clasificación y categorización automática:** organización por tipo, prioridad y severidad para optimizar trazabilidad.
* **Integración con otros microservicios SST:** generación de reportes consolidados con datos de inspecciones, planes de acción y métricas de salud ocupacional.
* **Notificaciones y alertas:** disparo automático ante hallazgos críticos o vencimientos próximos.
* **Documentación interactiva de la API:** endpoints descritos con Swagger para fácil consumo por otros sistemas y analistas de datos.

---

## 🧱 Tecnologías base

* **Backend:** NestJS (Node.js)
* **Base de datos:** SQL Server
* **Lenguaje:** TypeScript
* **Autenticación:** JWT
* **Documentación API:** Swagger/OpenAPI

---

## 🏗 Arquitectura

El microservicio expone una **API RESTful** que interactúa con otros microservicios del ecosistema SST a través de HTTP.
Está diseñado bajo **Clean Architecture** y principios de modularidad de NestJS, asegurando:

* Alta escalabilidad y mantenibilidad.
* Separación clara de capas (controladores, servicios, repositorios, DTOs).
* Integración con módulos globales de autenticación y auditoría.
* Compatibilidad con servicios centralizados de notificaciones y almacenamiento.

---

## 📄 Licencia

Este proyecto es parte del **ecosistema SST** de **New Stetic** y está sujeto a las políticas internas de la compañía.

---
