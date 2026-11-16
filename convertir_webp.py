import os
from PIL import Image

def convertir_a_webp(ruta_origen, calidad=80):
    """
    Convierte todas las imágenes PNG y JPG de una carpeta al formato WebP.
    
    :param ruta_origen: Carpeta donde se encuentran las imágenes.
    :param calidad: Calidad de compresión WebP (1-100). Por defecto 80.
    """
    # Extensiones permitidas
    extensiones_validas = ('.png', '.jpg', '.jpeg', 'HEIC', '.heic')
    
    # Crear carpeta de salida si no existe
    carpeta_salida = os.path.join(ruta_origen, "convertidas_webp")
    if not os.path.exists(carpeta_salida):
        os.makedirs(carpeta_salida)

    # Recorrer los archivos de la carpeta
    archivos = [f for f in os.listdir(ruta_origen) if f.lower().endswith(extensiones_validas)]
    
    if not archivos:
        print("No se encontraron imágenes PNG o JPG en la carpeta especificada.")
        return

    print(f"Procesando {len(archivos)} imágenes...\n")

    for archivo in archivos:
        ruta_imagen = os.path.join(ruta_origen, archivo)
        
        # Generar el nuevo nombre de archivo
        nombre_base = os.path.splitext(archivo)[0]
        ruta_salida = os.path.join(carpeta_salida, f"{nombre_base}.webp")

        try:
            with Image.open(ruta_imagen) as img:
                # Convertir a RGB si la imagen tiene modo RGBA (transparencias en PNG)
                # WebP soporta RGBA, pero esto evita conflictos si conviertes a otros formatos.
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
                
                # Guardar en formato WebP
                img.save(ruta_salida, "WEBP", quality=calidad)
                print(f"✔ Convertida: {archivo} -> {nombre_base}.webp")

        except Exception as e:
            print(f"✖ Error al procesar {archivo}: {e}")

    print(f"\n¡Proceso finalizado! Las imágenes se guardaron en: {carpeta_salida}")

# --- USO DEL SCRIPT ---
if __name__ == "__main__":
    # Cambia esta ruta por la carpeta donde tienes tus imágenes
    # Ejemplo en Windows: r"C:\Usuarios\TuUsuario\Imagenes"
    # Ejemplo en Linux/Mac: "/home/usuario/imagenes"
    carpeta_imagenes = r"C:\Users\User\Documents\Website_MakeUp_Xaret/img"  # Cambia esta ruta según tu necesidad

    convertir_a_webp(carpeta_imagenes, calidad=80)