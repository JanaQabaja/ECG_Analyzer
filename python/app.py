import sys
import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input

# Set encoding for sys.stdin and sys.stdout to UTF-8
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

# Load the saved model
model = tf.keras.models.load_model('C:/Users/PC/Desktop/ECG_Analyzer/python/ECG-train.h5')

# Define the class labels
class_labels = ['ECG Images of Myocardial Infarction Patients',
                'ECG Images of Patient that have abnormal heartbeat',
                'ECG Images of Patient that have History of MI',
                'Normal Person ECG Images']

# Function to predict class of an image
def predict_class(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Make prediction
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions[0])
    predicted_class = class_labels[predicted_class_index]
    return predicted_class

# Get the file path from command-line arguments
if len(sys.argv) < 2:
    print("Usage: python your_script.py filename")
    sys.exit(1)

file_path = sys.argv[1]

# Open and process the image file
try:
    predicted_class = predict_class(file_path)
    print("Prediction for ECG:", predicted_class)
except FileNotFoundError:
    print(f"File not found: {file_path}")
except Exception as e:
    print(f"An error occurred: {e}")
