<div align="center">
  <img 
    src=""
    alt="SmartPoll Logo"
    width="100%"
  >
</div>


# Proyecto G3: SmartPoll – Sistema de votación segura y transparente con Blockchain

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

| Componente                       | Cantidad | Uso                             |
| -------------------------------- | -------- | ------------------------------- |
| Raspberry Pi 3 Model B           | 2        | Mesa de ingreso y cuarto oscuro |
| Pantalla LCD 16x2 con módulo I2C | 1        | Mesa de ingreso                 |
| Cámara USB                       | 1        | Lectura de QR                   |
| Pantalla táctil                  | 1        | Interfaz de votación            |

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
├── votation-kiosk/              # Interfaz de votación (cuarto oscuro)
├── votation-server/             # Servidor central de votación
├── docker-compose.yml           # Orquestación local del sistema
├── docker-compose.stack.yml     # Despliegue distribuido
├── Makefile                     # Comandos de automatización
├── LICENSE                      # Licencia del proyecto
└── README.md                    # Documentación principal
</pre>

---

<h1 id="startup">🚀 Puesta en marcha del sistema</h1>

<p>
SmartPoll utiliza <b>Docker Compose</b> y un <b>Makefile</b> para simplificar la ejecución
del entorno completo de desarrollo, incluyendo los servicios backend y blockchain.
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

* **Blasco, Gonzalo**  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gonblas) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gonblas/)

* **Cabral, Ramiro Nicolás**  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ramirocabral) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ramirocabral04/)

* **Polanis, Iván Valentín**  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ivanpolanis) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ivanpolanis/)

---

<h1 id="coordinator">Coordinador</h1>

* **Gastón Marón**  
  _Profesor – Taller de Proyecto II_  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gmaron) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gastonmaron/)
