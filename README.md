# 🏢 Empresas & Transferencias API

Este challenge consiste en una API desarrollada en Node.js, Typescript y NestJS para gestionar información de **empresas** y sus **transferencias**, diseñada con foco en **Clean Code**, **arquitectura limpia** y **escalabilidad**.

---

## 📌 Descripción General

Esta solución expone las API de **empresas** y **transferencias** y sus respectivos endpoints RESTful para:

- Empresas:
  - Registrar nuevas empresas.
  - Consultar todas las empresas.
  - Consultar empresa por ID.
  - Consultar empresas registradas el último mes.
  - Consultar empresas que realizaron transferencias el último mes.

- Transferencias:
  - Registrar nuevas transferencias.
  - Consultar todas las transferencias.
  - Consultar transferencias realizadas el último mes.

La solución también incluye el diseño teórico de una **AWS Lambda** que registra la adhesión de una nueva empresa, lista para ser desacoplada del monolito si se desea evolucionar hacia una arquitectura serverless o basada en microservicios.

---

## 🎯 Requerimientos Funcionales

La API implementa los siguientes endpoints:

### 🏢 Empresa

1. **GET** `/api/company`  
   Devuelve todas empresas.

2. **GET** `/api/company/:id`  
   Devuelve si existe la compañía por ID.

3. **GET** `/api/company/addedLastMonth`  
   Devuelve las empresas que se registraron en el último mes.

4. **GET** `/api/company/withTransfersInLastMonth`  
   Devuelve las empresas que poseen transferencias realizadas el último mes.

5. **POST** `/api/company`  
   Registra la adhesión de una nueva empresa.

### 💸 Transferencia

1. **GET** `/api/transfer`  
   Devuelve todas transferencias.

2. **GET** `/api/transfer/madeLastMonth`  
  Devuelve las transferencias realizadas el último mes.

3. **POST** `/api/transfer`  
   Registra una nueva transferencia.

### λ AWS Lambda

La lambda propuesta es un diseño técnico y funcional de alto nivel pensado para mostrar la forma de implementarla destras del servicio API Gateway de AWS.

**🧩Propuestas de integración**
Se proponen las sigueintes integraciones al sistema actual en base a posibles requerimientos del negocio

1. Migración del monolito a servicios serverless
  La propuesta se basa en la idea de migrar todos los servicios a serverless pero de forma paulatina. Por ello se debe mantener el monolito activo y sin cambios de cara a los consumidores.
  Para mitigar el tiempo de respuesta que implica desacomplar el comportamiento a una lambda se propone invocarla mediante la SDK de AWS

2. Exponer a lambda por HTTP
  La exposición se realiza mediante API Gateway de AWS permitindo que la lambda se pueda consumir como un servicio clásico API REST

---

## 🧰 Requerimientos Técnicos

- **Lenguaje & Framework:**
  - Node.js + Typescrpt
  - NestJS
  - AWS Lambda + AWS DynamoDB
- **Persistencia:**
  - Backend: en memoria + Archivo JSON
  - Lambda: DynamoDB (implementación básica)
- **Arquitectura:**
  - Hexagonal

---

## 🧪 Pruebas

El proyecto incluye pruebas unitarias usando:

- **Jest** (u otro framework según implementación)
- Mocks para infraestructura externa
- Cobertura básica de casos de éxito y error

Ejecutar pruebas:

```bash
npm test
```

## 🚀 Cómo iniciar el proyecto

Seguí estos pasos para correr la aplicación de forma local:

### 📦 Instalación

1. Cloná este repositorio:
  
   ```bash
   git clone https://github.com/tu-usuario/tu-proyecto.git
   cd tu-proyecto
   ```
  
2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Variables de entorno:

   Se deben utilizar las siguientes variables de entorno

   ```bash
   NODE_ENV='development'
   PORT=3000
   ```

4. Ejecución:

   Ejecutá la aplicación:
  
   ```bash
   npm run start
   ```
  
   Debuguear la aplicación:

   ```bash
   npm run start:debug
   ```

5. Acceder a la API

   la URL base es y puerto por defecto:

   ```curl
   http://localhost:3000/api
   ```
  