<div align="center">
  <img 
    src="https://github.com/user-attachments/assets/d28b0f95-aac5-4601-a732-8da9fda06d39"
    alt="SmartPoll Logo"
    width="100%"
  >
</div>

# Proyecto G3: SmartPoll – Sistema de votación segura y transparente con Blockchain

## Flujo de funcionamiento del sistema

![Flujo de funcionamiento del sistema](smartpoll-2.gif)


<details>
  <summary><i>Flujo completo del proceso de votación</i></summary>
  <img width="1999" height="1359" alt="image10" src="https://github.com/user-attachments/assets/a02d50ed-7a5f-43d7-8003-ceb3f6cb6188" />
  <ol>
    <li><b>Registro del votante en la plataforma web</b></li>
    <p>Antes de iniciar el proceso, el votante debe registrarse en la plataforma web ingresando su correo electrónico, DNI y una contraseña, quedando identificado de manera única dentro del sistema.</p>

  <li><b>Generación del QR-Pase firmado</b></li>
    <p>Una vez validado el registro, el sistema genera un token aleatorio y lo asocia a un QR-Pase único y firmado digitalmente, vinculado al DNI del votante. El QR se muestra en la plataforma para su posterior presentación en la mesa de ingreso.</p>

  <li><b>Almacenamiento del token asociado al QR-Pase</b></li>
    <p>El token generado se almacena en la base de datos en la nube, quedando disponible para ser validado en el momento del sufragio.</p>

  <li><b>Presentación del QR-Pase por parte del votante</b></li>
    <p>El votante presenta el QR-Pase desde su dispositivo personal en la mesa de entrada para iniciar el proceso de verificación.</p>

  <li><b>Escaneo del QR-Pase</b></li>
    <p>Una Raspberry Pi equipada con una cámara USB escanea el QR-Pase presentado por el votante y envía la información al servidor para su validación.</p>

  <li><b>Validación y marcado del QR-Pase</b></li>
    <p>La Raspberry Pi consulta al servidor en la nube para verificar si el QR-Pase es válido y no ha sido utilizado previamente. Si es válido, el sistema lo marca como consumido; si no, se deniega el acceso al cuarto oscuro.</p>

  <li><b>Notificación del estado mediante SSE</b></li>
    <p>A través de una conexión Server-Sent Events (SSE), el servidor notifica al cliente que el QR-Pase fue consumido exitosamente. El dispositivo del votante indica que está habilitado para ingresar al cuarto oscuro y la conexión se cierra.</p>

  <li><b>Habilitación de la interfaz de votación</b></li>
    <p>Cuando la Raspberry Pi de la mesa de entrada autoriza el ingreso, la Raspberry Pi ubicada en el cuarto oscuro genera y firma un Token Anónimo de Votación (TAV), habilitando la interfaz de votación para el votante.</p>

  <li><b>Emisión y envío del voto</b></li>
    <p>El votante emite su voto, el cual se envía junto con el TAV firmado al servidor para su validación y posterior registro.</p>

  <li><b>Registro del TAV en la blockchain permisionada</b></li>
    <p>El Token Anónimo de Votación se registra como una transacción en la blockchain permisionada, garantizando inmutabilidad, trazabilidad y un conteo verificable de los votos.</p>

  <li><b>Habilitación de un nuevo escaneo</b></li>
    <p>Una vez finalizado el proceso de votación, la Raspberry Pi del cuarto oscuro se comunica con la Raspberry Pi de la mesa de entrada para habilitar un nuevo escaneo de QR-Pase.</p>
  </ol>
</details>


---

## Descripción del proyecto

SmartPoll es un sistema de votación electrónica diseñado con fines educativos que integra **blockchain permisionada**, **códigos QR firmados digitalmente** y **Tokens Anónimos de Voto (TAV)** para garantizar seguridad, transparencia y trazabilidad, preservando al mismo tiempo la privacidad del votante.

El sistema implementa un flujo de votación con **pase de acceso**, donde cada votante recibe un **QR-Pase único firmado** que valida su ingreso al proceso electoral. Una vez autenticado, se emite un **Token Anónimo de Voto (TAV)** que permite sufragar sin vincular identidad con preferencia, evitando el doble voto y asegurando un conteo verificable mediante blockchain.

<details>
  <summary><i>Características del proyecto</i></summary>
  <ol>
    <li><b>Acceso controlado mediante QR firmado</b></li>
    <p>Cada votante recibe un QR-Pase único, aleatorio y firmado digitalmente que valida su derecho a ingresar al sistema de votación.</p>

  <li><b>Separación identidad–voto</b></li>
  <p>El sistema desacopla completamente la identidad del votante de su elección mediante el uso de Tokens Anónimos de Voto (TAV).</p>

  <li><b>Prevención de doble voto</b></li>
  <p>Los QRs y TAVs son marcados como utilizados una única vez, impidiendo reutilizaciones y garantizando la unicidad del voto.</p>

  <li><b>Registro inmutable en blockchain</b></li>
  <p>Cada voto se registra como una transacción en una blockchain permisionada, permitiendo auditoría y verificación posterior.</p>

  <li><b>Auditoría y trazabilidad</b></li>
  <p>Se pueden auditar los hashes de los TAVs consumidos y verificar que coincidan con la cantidad de votos emitidos.</p>
  </ol>
</details>

<details>
  <summary><i>Beneficios</i></summary>
  <ol>
    <li>Transparencia electoral</li>
    <p>Permite verificar el proceso completo de votación sin comprometer la privacidad del votante.</p>

  <li>Confianza en el sistema</li>
  <p>La inmutabilidad de blockchain y la firma digital de los tokens fortalecen la confianza en los resultados.</p>

  <li>Privacidad garantizada</li>
  <p>No existe vinculación directa entre el votante y su elección.</p>

  <li>Escalabilidad educativa</li>
  <p>El sistema puede adaptarse a distintos escenarios de votación académicos o experimentales.</p>
  </ol>
</details>

<details>
  <summary><i>Tecnologías utilizadas</i></summary>
  <ol>

  <li>Hardware</li>
    <ul>
      <li>Raspberry Pi 3 Model B: utilizadas en la mesa de ingreso y en el cuarto oscuro</li>
      <li>Cámara USB Logitech C170: lectura del QR-Pase</li>
      <li>Pantalla LCD 16x2 con módulo I2C: notificación del estado del escaneo</li>
      <li>Pantalla táctil HDMI + USB: interfaz de votación</li>
    </ul>

  <li>Frontend</li>
    <ul>
      <li>React con TypeScript</li>
      <li>Vite + SWC para bundling y compilación</li>
      <li>TailwindCSS para estilos</li>
      <li>Radix UI y shadcn/ui para componentes accesibles</li>
      <li>Server-Sent Events (SSE) para comunicación en tiempo real</li>
      <li>pnpm como gestor de dependencias</li>
    </ul>

   <li>Backend</li>
    <ul>
      <li>Spring Boot 3 sobre Java 21 LTS (gestión de usuarios y emisión de QR-Pase)</li>
      <li>Node.js + Express (servidor central de votación y gestión de TAVs)</li>
      <li>Python + Flask (servicio de escaneo de QR en Raspberry Pi)</li>
      <li>Redis para almacenamiento temporal de TAVs con TTL</li>
      <li>APIs HTTP/REST</li>
      <li>Server-Sent Events (SSE) para sincronización entre servicios</li>
    </ul>

  <li>Blockchain</li>
    <ul>
      <li>Hyperledger Fabric (blockchain permisionada)</li>
      <li>Smart Contracts desarrollados en TypeScript</li>
      <li>Canales independientes por elección</li>
      <li>Certificados X.509 para autenticación de organizaciones</li>
      <li>Hyperledger Explorer para visualización y auditoría</li>
    </ul>

  <li>Infraestructura y despliegue</li>
    <ul>
      <li>Docker y Docker Compose</li>
      <li>Amazon Web Services (AWS)</li>
      <li>Amazon ECS y ECR</li>
      <li>Amazon S3 y CloudFront</li>
      <li>Amazon RDS</li>
      <li>Elastic Load Balancer (ELB)</li>
      <li>Virtual Private Cloud (VPC)</li>
      <li>Terraform para Infraestructura como Código (IaC)</li>
      <li>GitHub Actions para CI/CD</li>
    </ul>

  </ol>
</details>

---

<h1 id="architecture">Arquitectura del sistema</h1>

<p>SmartPoll se compone de dos estaciones físicas principales conectadas a una red local y a una blockchain permisionada:</p>

<ul>
  <li><b>Mesa de ingreso:</b> validación del QR-Pase y generación del Token Anónimo de Voto (TAV)</li>
  <li><b>Cuarto oscuro:</b> validación del TAV y emisión del voto</li>
</ul>

---

<h1 id="materials">Materiales</h1>

<div align="center">

| Componente                       | Cantidad | Uso                             |
| -------------------------------- | -------- | ------------------------------- |
| Raspberry Pi 3 Model B           | 2        | Mesa de ingreso y cuarto oscuro |
| Pantalla LCD 16x2 con módulo I2C | 1        | Mesa de ingreso                 |
| Cámara USB                       | 1        | Lectura de QR                   |
| Pantalla táctil                  | 1        | Interfaz de votación            |

</div>

---


<h1 id="structure">Estructura del proyecto</h1>

<p>
El repositorio de <b>SmartPoll</b> se organiza de forma modular, separando claramente las
responsabilidades del sistema de votación electrónica (frontend, backend, blockchain,
infraestructura y auditoría). Esta estructura facilita el mantenimiento, la escalabilidad
y el despliegue independiente de cada componente.
</p>

<pre>
SmartPoll/
│
├── .github/                     # Configuración de GitHub
│   └── workflows/               # Pipelines de CI/CD
│
├── audit-app/                   # Aplicación web de auditoría
├── backend/                     # Gestión de usuarios y QR-Pase
├── blockchain/                  # Red blockchain permisionada
│   ├── fabric-chain/            # Smart contracts (TAV y votos)
│   └── explorer/                # Visualización y auditoría
├── infra/                       # Infraestructura como Código (IaC)
├── qr-access-app/               # Frontend de acceso del votante
├── qr-scan/                     # Servicio de escaneo de QR (Raspberry Pi)
├── reports/                     # Informes del proyecto
├── votation-kiosk/              # Interfaz de votación (cuarto oscuro)
├── votation-server/             # Servidor central de votación
├── docker-compose.yml           # Orquestación local del sistema
├── docker-compose.stack.yml     # Despliegue distribuido
├── Makefile                     # Comandos de automatización
├── LICENSE                      # Licencia del proyecto
└── README.md                    # Documentación principal
</pre>

---

<h1 id="bitacora">Bitácora del proyecto</h1>

<p>
La bitácora documenta el proceso de diseño, implementación, pruebas e iteraciones del sistema SmartPoll,
incluyendo decisiones técnicas, problemas encontrados y soluciones adoptadas a lo largo del desarrollo.
</p>

<ul>
  <li>
    📓 <b>Bitácora completa del proyecto</b>:
    <a href="https://github.com/tpII/2025-G3-SmartPoll/wiki/Bit%C3%A1cora" target="_blank">
      Ver bitácora
    </a>
  </li>
</ul>

---

<h1 id="screenshots">Capturas del sistema</h1>

<!-- QR-Pase -->
<h3>Interfaz de escaneo de QR-Pase</h3>

<p align="center">
  <img width="31%" alt="Login SmartPoll"
       src="https://github.com/user-attachments/assets/2ad3255f-64d1-4d34-ac56-e083fbcef568" />
  <img width="30.65%" alt="QR-Pase generado"
       src="https://github.com/user-attachments/assets/ba5d9436-a238-4c9d-ad9c-cfb7cf5c500b" />
  <img width="30.35%" alt="QR-Pase validado"
       src="https://github.com/user-attachments/assets/7db8534f-6ea3-44a3-869e-14e99becabac" />
</p>

<p align="center">
  <i>Login del votante, visualización del QR-Pase y validación exitosa</i>
</p>

---

<!-- Votación -->
<h3>Interfaz de votación</h3>

<p align="center">
  <img width="50%" alt="Votación en espera"
       src="https://github.com/user-attachments/assets/1722c7e3-5857-4b4a-8ccf-8702a011044a" />
  <img width="47.3%" alt="Selección de candidato"
       src="https://github.com/user-attachments/assets/11030087-c914-42cf-b9a1-817e95100353" />
</p>

<p align="center">
  <i>Pantalla de espera y emisión del voto en el cuarto oscuro</i>
</p>

---

<!-- Auditoría -->
<h3>Interfaz de auditoría</h3>

<p align="center">
  <img width="80%" alt="Auditoría de votos"
       src="https://github.com/user-attachments/assets/63d01264-94a6-44da-9f17-138e924e4e97" />
</p>

<p align="center">
  <i>Visualización de resultados y auditoría del proceso electoral</i>
</p>

---

<!-- Blockchain -->
<h3>Visualización de la blockchain</h3>

<p align="center">
  <img width="80%" alt="Hyperledger Explorer"
       src="https://github.com/user-attachments/assets/629fc943-a1cd-45ad-8543-26c25de34c05" />
</p>

<p align="center">
  <i>Hyperledger Explorer – bloques y transacciones registradas</i>
</p>


---

<h1 id="startup">Puesta en marcha del sistema</h1>

<p>
SmartPoll utiliza <b>Docker Compose</b> y un <b>Makefile</b> para simplificar la ejecución
del entorno completo de desarrollo, incluyendo los servicios Webserver + Frontend + Blockchain + Explorer.
</p>

<p>Para construir las imágenes y levantar tales servicios del sistema:</p>

```bash
make
```

<p>Este comando inicializa la red blockchain, levanta los contenedores necesarios y deja el sistema listo para su uso en un entorno local.</p> <p>Para detener y eliminar todos los contenedores creados:</p>

```bash
make down
```

<p> Esto apaga el entorno de ejecución liberando los recursos utilizados. </p>

---

<h1 id="authors">Autores</h1>

<ul>
  <li>
    <a href="https://www.linkedin.com/in/gonblas/">
      <img align="right" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
    </a>
    <a href="https://github.com/gonblas">
      <img align="right" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" style="margin-right: 5px;" />
    </a>
    <strong>Blasco, Gonzalo</strong>
    <br clear="right"/>
  </li>

  <li>
    <a href="https://www.linkedin.com/in/ramirocabral04/">
      <img align="right" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
    </a>
    <a href="https://github.com/ramirocabral">
      <img align="right" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" style="margin-right: 5px;" />
    </a>
    <strong>Cabral, Ramiro Nicolás</strong>
    <br clear="right"/>
  </li>

  <li>
    <a href="https://www.linkedin.com/in/ivanpolanis/">
      <img align="right" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
    </a>
    <a href="https://github.com/ivanpolanis">
      <img align="right" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" style="margin-right: 5px;" />
    </a>
    <strong>Polanis, Iván Valentín</strong>
    <br clear="right"/>
  </li>
</ul>

<h1 id="coordinator">Coordinador</h1>

<ul>
  <li>
    <a href="https://www.linkedin.com/in/gastonmaron/">
      <img align="right" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
    </a>
    <a href="https://github.com/gmaron">
      <img align="right" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" style="margin-right: 5px;" />
    </a>
    <strong>Gastón Marón</strong><br />
    <em>Profesor – Taller de Proyecto II</em>
    <br clear="right"/>
  </li>
</ul>

