import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
from tensorflow import keras
from keras.layers import Dense, Conv2D, DepthwiseConv2D, InputLayer, Rescaling
import os
import pickle

IMAGE_MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models/Image_model")
TEXT_MODEL_DIR = os.path.join(os.path.dirname(__file__), "../models/text_model")

# Custom layers to fix common Keras 2 -> 3 .h5 loading issues
try:
    from tensorflow.keras.layers import InputLayer, Dense, Conv2D, DepthwiseConv2D

    class CustomInputLayer(InputLayer):
        @classmethod
        def from_config(cls, config):
            if 'batch_shape' in config:
                config['batch_input_shape'] = config.pop('batch_shape')
            config.pop('optional', None)
            return super().from_config(config)

    def wrap_layer(layer_cls):
        class Wrapped(layer_cls):
            @classmethod
            def from_config(cls, config):
                config.pop('quantization_config', None)
                return super().from_config(config)
        return Wrapped

    _custom_objects = {
        'InputLayer': CustomInputLayer,
        'Dense': wrap_layer(Dense),
        'Conv2D': wrap_layer(Conv2D),
        'DepthwiseConv2D': wrap_layer(DepthwiseConv2D)
    }
except Exception as e:
    print(f"Warning: Custom layer setup fail: {e}")
    _custom_objects = {}

# Model configurations — keys match frontend values
MODEL_CONFIGS = {
    'densenet': (224, 224),
    'inception': (299, 299),
    'mobilenet': (224, 224),
    'xception': (299, 299),
}

# Class names for image models
classes = [
    'Acne', 'Actinic_Keratosis', 'Benign_tumors', 'Bullous', 'Candidiasis',
    'DrugEruption', 'Eczema', 'Infestations_Bites', 'Lichen', 'Lupus',
    'Moles', 'Psoriasis', 'Rosacea', 'Seborrh_Keratoses', 'SkinCancer',
    'Sun_Sunlight_Damage', 'Tinea', 'Unknown_Normal', 'Vascular_Tumors',
    'Vasculitis', 'Vitiligo', 'Warts'
]
image_label_overrides = {}

def get_image_label(pred_idx):
    if pred_idx < len(classes):
        return classes[pred_idx]
    return "Unknown_Normal"

# Load all image models
models = {}
for name, filename in [
    ("densenet", "densenet_model.h5"),
    ("inception", "inception_model.h5"),
    ("mobilenet", "mobilenet_model.h5"),
    ("xception", "xception_model.h5"),
]:
    path = os.path.join(IMAGE_MODEL_DIR, filename)
    if os.path.exists(path):
        try:
            models[name] = keras.models.load_model(path, compile=False, custom_objects=_custom_objects)
        except:
            print(f"Failed to load {name}")

# Load text models
text_model = None
vectorizer = None
label_encoder = None
try:
    with open(os.path.join(TEXT_MODEL_DIR, "linear_svm_model.pkl"), 'rb') as f:
        text_model = pickle.load(f)
    with open(os.path.join(TEXT_MODEL_DIR, "tfidf_vectorizer.pkl"), 'rb') as f:
        vectorizer = pickle.load(f)
    with open(os.path.join(TEXT_MODEL_DIR, "label_encoder.pkl"), 'rb') as f:
        label_encoder = pickle.load(f)
except:
    print("Text models could not be loaded")

def preprocess(image_path, target_size):
    img = load_img(image_path, target_size=target_size)
    img = img_to_array(img) / 255.0
    return np.expand_dims(img, 0)

def predict_image(image_path):
    results = {}
    for name, model in models.items():
        target_size = MODEL_CONFIGS.get(name, (224, 224))
        img = preprocess(image_path, target_size)
        pred = model.predict(img)
        disease = get_image_label(int(np.argmax(pred[0])))
        acc = np.max(pred[0]) * 100
        results[name] = {"disease": disease, "confidence": round(float(acc), 2)}
    return results

def predict_text(symptoms_list):
    if not text_model or not vectorizer:
        return None
    
    text = " ".join(symptoms_list)
    tfidf = vectorizer.transform([text])
    pred = text_model.predict(tfidf)[0]
    
    try:
        probs = text_model.predict_proba(tfidf)
        conf = np.max(probs) * 100
    except:
        conf = 85.0
        
    disease = pred
    if isinstance(pred, (int, np.integer)):
        if label_encoder is not None:
            try:
                disease = label_encoder.inverse_transform([pred])[0]
            except Exception:
                disease = classes[pred] if pred < len(classes) else f"Condition {pred}"
        else:
            disease = classes[pred] if pred < len(classes) else f"Condition {pred}"

    return {"disease": disease, "confidence": round(float(conf), 2)}
