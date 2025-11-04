import cv2
from pyzbar.pyzbar import decode
import requests
import time
import threading
from flask import Flask, request

# --- Configuración ---
api_url = "https://api.smartpoll.tech/api/qr/consume/"
voting_ui_url = "http://192.168.9.2:8080/authorize-voter"  # reemplazar por el endpoint de tu interfaz LAN
camera_index = 0

# --- Estado global ---
scanning_enabled = False
last_qr = None

# --- Servidor HTTP para controlar el flujo ---
app = Flask(__name__)

@app.route("/start", methods=["POST"])
def start_scanning():
    global scanning_enabled
    scanning_enabled = True
    print("[INFO] Escaneo habilitado (start recibido)")
    return {"status": "ok", "message": "Escaneo habilitado"}

@app.route("/resume", methods=["POST"])
def resume_scanning():
    global scanning_enabled, last_qr
    last_qr = None
    scanning_enabled = True
    print("[INFO] Reanudando escaneo tras votación")
    return {"status": "ok", "message": "Escaneo reanudado"}

def run_server():
    app.run(host="0.0.0.0", port=5000, debug=False)

# --- Función principal de escaneo ---
def qr_scanner():
    global scanning_enabled, last_qr

    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        raise Exception("No se pudo abrir la cámara")

    print("[INFO] Sistema iniciado en estado BLOQUEADO.")
    print("Esperando señal de /start para comenzar...")

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
                if qr_data != last_qr:
                    print(f"[QR DETECTADO] {qr_data}")
                    try:
                        # Request al backend
                        r = requests.post(api_url + qr_data, timeout=5)
                        print(f"SmartPoll → {r.status_code}: {r.text}")

                        # Notificar a la interfaz local de votación
                        requests.post(voting_ui_url, json={"qr": qr_data}, timeout=5)
                        print(f"Notificado a interfaz LAN: {voting_ui_url}")

                        # Bloqueamos nuevamente hasta /resume
                        scanning_enabled = False
                        last_qr = qr_data
                        print("[INFO] Escaneo bloqueado. Esperando /resume...")
                    except Exception as e:
                        print(f"[ERROR] Request fallido: {e}")
                    time.sleep(1)

    except KeyboardInterrupt:
        print("Saliendo...")
    finally:
        cap.release()
        cv2.destroyAllWindows()

# --- Ejecución concurrente ---
if __name__ == "__main__":
    threading.Thread(target=run_server, daemon=True).start()
    qr_scanner()
