import cv2
from pyzbar.pyzbar import decode
import requests
import time

# Inicia la camara
cap = cv2.VideoCapture(0)  # 0 = primera camara USB
api_url = "http://sp-alb-1004216717.us-east-1.elb.amazonaws.com/api/qr/consume/"

if not cap.isOpened():
    raise Exception("No se pudo abrir la cámara")

print("Esperando QR...")

last_qr = None

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        # decodifica QR en el frame
        codes = decode(frame)

        for code in codes:
            qr_data = code.data.decode('utf-8')
            if qr_data != last_qr:  # evita repeticiones
                print(f"QR detectado: {qr_data}")
                try:
                    url = api_url + qr_data
                    r = requests.post(url, timeout=5)
                    print(f"Request a {url} -> {r.status_code}")
                    print(r.text)
                except Exception as e:
                    print(f"Error al hacer request: {e}")

                last_qr = qr_data
                time.sleep(2)  # pausa para no saturar

except KeyboardInterrupt:
    print("Saliendo...")
finally:
    cap.release()
    cv2.destroyAllWindows()
