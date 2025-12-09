import cv2
from pyzbar.pyzbar import decode
import requests
import time
import threading
from flask import Flask, request
from RPLCD.i2c import CharLCD

# --- Configuración ---
api_url = "https://api.smartpoll.tech/api/qr/consume"
voting_ui_url = "http://192.168.9.2:8080/authorize-voter"
camera_index = 0

# --- Configuración LCD I2C ---
try:
    lcd = CharLCD(i2c_expander='PCF8574', address=0x27, port=1,
                  cols=16, rows=2, dotsize=8,
                  charmap='A00',
                  auto_linebreaks=True,
                  backlight_enabled=True)
    lcd.clear()
except Exception as e:
    print(f"[ERROR HARDWARE] No se detecta el LCD I2C: {e}")
    lcd = None

# --- Estado global ---
scanning_enabled = False
last_qr = None  # Guardará el último QR leído para evitar lecturas dobles inmediatas

# --- Servidor HTTP ---
app = Flask(__name__)

def update_lcd(line1, line2=""):
    """Función auxiliar robusta para LCD"""
    if lcd is None: return
    try:
        lcd.clear()
        time.sleep(0.2)
        line1 = line1[:16]
        line2 = line2[:16]
        lcd.write_string(line1)
        lcd.cursor_pos = (1, 0)
        lcd.write_string(line2)
    except Exception as e:
        print(f"[LCD Error] {e}")

@app.route("/start", methods=["POST"])
def start_scanning():
    global scanning_enabled, last_qr
    # Reiniciamos last_qr aquí para permitir que el primer votante
    # sea el mismo que el último de la sesión anterior si fuera necesario.
    last_qr = None
    scanning_enabled = True
    print("[INFO] Escaneo habilitado (start recibido)")
    update_lcd("Listo para votar", "Escanee su QR")
    return {"status": "ok", "message": "Escaneo habilitado"}

@app.route("/resume", methods=["POST"])
def resume_scanning():
    global scanning_enabled
    # IMPORTANTE: NO reiniciamos last_qr a None aquí.
    # Si la cámara sigue apuntando al QR viejo, last_qr evitará que se procese de nuevo.
    scanning_enabled = True
    print("[INFO] Reanudando escaneo tras votación")
    update_lcd("Listo para votar", "Escanee su QR")
    return {"status": "ok", "message": "Escaneo reanudado"}

def run_server():
    app.run(host="0.0.0.0", port=5000, debug=False)

# --- Función principal de escaneo ---
def qr_scanner():
    global scanning_enabled, last_qr

    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        update_lcd("Error Fatal", "Camara no inicia")
        raise Exception("No se pudo abrir la cámara")

    print("[INFO] Sistema iniciado en estado BLOQUEADO.")
    update_lcd("Sistema Iniciado", "Esperando Start")

    try:
        while True:
            if not scanning_enabled:
                time.sleep(0.2)
                continue

            ret, frame = cap.read()
            if not ret:
                continue

            codes = decode(frame)
            for code in codes:
                qr_data = code.data.decode("utf-8")

                # Evitamos leer el mismo QR consecutivamente
                if qr_data != last_qr:
                    print(f"[QR DETECTADO] {qr_data}")
                    update_lcd("QR Detectado", "Verificando...")

                    try:
                        r = requests.post(api_url, params={"token": qr_data}, timeout=5)

                        print(f"URL Generada: {r.url}")
                        print(f"SmartPoll -> {r.status_code}: {r.text}")

                        # --- CASO ÉXITO (200-299) ---
                        if 200 <= r.status_code < 300:
                            # Notificar interfaz LAN
                            requests.post(voting_ui_url, json={"qr": qr_data}, timeout=5)
                            print(f"Notificado a interfaz LAN: {voting_ui_url}")

                            update_lcd("Codigo Valido!", "Pase a votar >>")

                            # AQUÍ SÍ BLOQUEAMOS: Esperamos a que termine de votar (/resume)
                            scanning_enabled = False
                            last_qr = qr_data # Guardamos para no releerlo inmediatamente al resume

                            print("[INFO] Escaneo bloqueado. Esperando /resume...")

                        # --- CASO ERROR (409, 404, etc) ---
                        else:
                            error_text = r.text

                            if "already been consumed" in error_text:
                                # Caso 1: Ya fue usado
                                update_lcd("Error: Ya Voto", "QR Consumido")

                            elif "not a valid UUID" in error_text:
                                # Caso 2: Formato inválido (basura, url, etc)
                                update_lcd("Error Formato", "QR Invalido")

                            else:
                                # Caso 3: Otro error desconocido
                                update_lcd("Error Sistema", "Rechazado")

                            # Actualizamos last_qr para que no intente mandar el mismo error
                            # 20 veces por segundo mientras el papel sigue ahí.
                            last_qr = qr_data

                            # NO BLOQUEAMOS (scanning_enabled sigue True)
                            # Solo pausamos un momento para que lea el error
                            time.sleep(3)

                            # Volvemos a mostrar pantalla de listo
                            update_lcd("Listo para votar", "Escanee su QR")

                    except Exception as e:
                        print(f"[ERROR] Request fallido: {e}")
                        update_lcd("Error de Red", "Intente de nuevo")
                        time.sleep(2)
                        update_lcd("Listo para votar", "Escanee su QR")
                        # En error de red, NO actualizamos last_qr para permitir reintento inmediato

                    time.sleep(1)

    except KeyboardInterrupt:
        print("Saliendo...")
        update_lcd("Sistema", "Apagado")
        time.sleep(1)
        if lcd: lcd.close(clear=True)
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    update_lcd("Cargando...", "SmartPoll V1.0")
    time.sleep(2)
    threading.Thread(target=run_server, daemon=True).start()
    qr_scanner()
