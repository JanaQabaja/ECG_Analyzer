import sys
import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input

# Set encoding for sys.stdin and sys.stdout to UTF-8 to handle Unicode characters
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

# Load the saved TensorFlow model from the specified path
model = tf.keras.models.load_model('C:/Users/PC/Desktop/ECG_Analyzer/python/ECG-train.h5')

# Define the class labels that correspond to the model's output classes
class_labels = [
    'Myocardial Infarction Patients',  # Class 0
    'Patient that have abnormal heartbeat',  # Class 1
    'Patient that have History of MI',  # Class 2
    'Normal Person ECG Images'  # Class 3
]

# Function to predict the class of an image
def predict_class(img_path):
    # Load the image from the specified path and resize it to the expected input size for the model
    img = image.load_img(img_path, target_size=(224, 224))
    # Convert the image to a numpy array
    img_array = image.img_to_array(img)
    # Expand dimensions to match the model's input shape
    img_array = np.expand_dims(img_array, axis=0)
    # Preprocess the image data
    img_array = preprocess_input(img_array)

    # Make a prediction using the loaded model
    predictions = model.predict(img_array)
    # Get the index of the class with the highest predicted probability
    predicted_class_index = np.argmax(predictions[0])
    # Map the predicted index to the class label
    predicted_class = class_labels[predicted_class_index]
    return predicted_class

# Check if the file path is provided as a command-line argument
if len(sys.argv) < 2:
    # Print usage information if the file path is not provided
    print("Usage: python your_script.py filename")
    sys.exit(1)

# Get the file path from the command-line arguments
file_path = sys.argv[1]

# Try to open and process the image file
try:
    # Predict the class of the image
    predicted_class = predict_class(file_path)
    # Print the prediction result
    print("Prediction for ECG:", predicted_class)
# Handle the case where the file is not found
except FileNotFoundError:
    print(f"File not found: {file_path}")
# Handle any other exceptions that may occur
except Exception as e:
    print(f"An error occurred: {e}")
