# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image
# from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
# import numpy as np

# # Load your model
# model = load_model('C:/Users/PC/Desktop/ECG_Analyzer/python/ECG-train.h5')

# # Load the image
# img_path = 'C:/Users/PC/Desktop/ECG_Analyzer/python/HB   (9).jpg'  # Replace 'path_to_your_image.jpg' with the actual path to your image
# img = image.load_img(img_path, target_size=(224, 224))

# # Preprocess the image
# img_array = image.img_to_array(img)
# img_array = np.expand_dims(img_array, axis=0)
# img_array = preprocess_input(img_array)

# # Make predictions
# predictions = model.predict(img_array)

# # Get the predicted class
# class_names = ['ECG Images of Myocardial Infarction Patients', 'ECG Images of Patient that have abnormal heartbeat', 'ECG Images of Patient that have History of MI', 'Normal Person ECG Images']
# predicted_class_index = np.argmax(predictions[0])
# predicted_class = class_names[predicted_class_index]

# # Print the predicted class
# print("Predicted class:", predicted_class)
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model

# Load the model
model = load_model('ECG-train.h5')

# Define class names
class_names = ['ECG Images of Myocardial Infarction Patients',
               'ECG Images of Patient that have abnormal heartbeat',
               'ECG Images of Patient that have History of MI',
               'Normal Person ECG Images']

# Load and preprocess the image
img_path = sys.argv[1]
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)

# Make prediction
predictions = model.predict(img_array)
predicted_class_index = np.argmax(predictions[0])
predicted_class = class_names[predicted_class_index]

# Return predicted class
print(predicted_class)
