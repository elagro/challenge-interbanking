# 🏢 Empresas & Transferencias API

Este challenge consiste en una API desarrollada en Node.js, Typescript y NestJS para gestionar información de **empresas** y sus **transferencias**, persistencia en base de datos NoSQL MongoDB y diseñada con foco en **Clean Code**, **arquitectura limpia** y **escalabilidad**.

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

La función Lambda presentada es una propuesta técnica y funcional de alto nivel, diseñada para demostrar cómo implementar un servicio detrás de API Gateway en AWS. Para la persistencia y validación de datos se utilizó una solución sencilla basada en una tabla de DynamoDB.

**🧩Propuestas de integración**
A continuación se detallan posibles integraciones con el sistema actual, pensadas en función de necesidades comunes del negocio:

1. **Migración del monolito a arquitectura serverless**
Se plantea una transición gradual hacia servicios serverless, manteniendo el monolito original sin modificaciones desde la perspectiva de los consumidores. Para minimizar el impacto en los tiempos de respuesta que puede delegar ciertas funcionalidades a una Lambda, se propone invocarla desde el monolito utilizando el SDK de AWS.

2. **Exposición de la Lambda a través de HTTP**
Se sugiere exponer la función Lambda mediante API Gateway, lo que permite consumirla como un servicio HTTP tradicional siguiendo el estilo REST.

---

## 🧰 Requerimientos Técnicos

- **Lenguaje & Framework:**
  - Node.js + Typescrpt
  - NestJS
  - MongoDB + Mongoose
  - AWS Lambda + API Gateway + DynamoDB
- **Persistencia:**
  - Backend: MongoDB
  - Lambda: DynamoDB (implementación básica)
- **Arquitectura:**
  - Hexagonal

---

## 🧪 Pruebas

El proyecto incluye cuatro pruebas unitarias usando:

- Jest
- Mocks de persistencia
- Cobertura básica de casos de éxito y error

Ejecutar pruebas:

```bash
npm test
```

## 🚀 Cómo iniciar el proyecto

Seguí estos pasos para correr la aplicación de forma local:

### 📦 Instalación

1. Descomprimí el .zip o cloná este repositorio:
  
   ```bash
   git clone https://github.com/elagro/challenge-interbanking.git
   cd challenge-interbanking
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
   MONGO_URI=''
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
6. Colección de Postman de ejemplo
   ```
   https://personal-3778.postman.co/workspace/nestDemo~9b4f2cf6-0451-4f36-9d46-9ef236d9842e/collection/7168484-aa5fbaec-7a44-428b-bec5-863a0d9641bd?action=share&creator=7168484
   ```
