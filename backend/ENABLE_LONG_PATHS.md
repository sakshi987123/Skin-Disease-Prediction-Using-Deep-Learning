# Enabling Real AI Predictions (DermaCure AI)

When the prediction API shows **"Real predictions unavailable"** or **mock mode**, follow these steps to load the skin-disease models.

---

## 1) Enable Windows Long Paths

TensorFlow often fails to load `.h5` model files when paths exceed 260 characters. Enabling long paths fixes this.

### Option A: PowerShell (recommended)

1. **Open PowerShell as Administrator**  
   Right-click **PowerShell** → **Run as administrator**.

2. **Allow script execution** (one-time, if needed):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Run the script** from the project’s `backend` folder:
   ```powershell
   cd "C:\Users\yashr\Downloads\DermaCure AI - Copy\backend"
   .\ENABLE_LONG_PATHS.ps1
   ```

4. **Restart** your terminal (and optionally your PC) so the change is applied.

### Option B: Registry (manual)

1. Press **Win + R**, type `regedit`, press Enter.
2. Go to:  
   `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. Set **LongPathsEnabled** to **1** (DWORD). Create it if it doesn’t exist.
4. Restart your terminal or PC.

---

## 2) Install TensorFlow (use Python 3.10 for .h5 models)

**.h5 models often fail to load on Python 3.11+** with errors like *"Error when deserializing class 'InputLayer'"*. Use **Python 3.10** and **TensorFlow 2.12** for best compatibility.

### Option A: Python 3.10 + TensorFlow 2.12 (recommended if models don’t load)

1. **Install Python 3.10** from [python.org](https://www.python.org/downloads/) (e.g. 3.10.11). During setup, check **"Add Python to PATH"** and optionally **"py launcher"**.
2. **Create a virtual environment** with Python 3.10 and install pinned versions:

```powershell
cd "C:\Users\yashr\Downloads\DermaCure AI - Copy\backend"
py -3.10 -m venv venv310
.\venv310\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install "tensorflow==2.12.0"
pip install flask flask-cors opencv-python-headless numpy
```

3. **Run the app** with this environment:

```powershell
.\venv310\Scripts\Activate.ps1
python app.py
```

### Option B: Current Python (try if you don’t have Python 3.10)

From the project root or `backend` folder:

```bash
python -m pip install --upgrade pip
pip install tensorflow
pip install tf_keras
pip install flask flask-cors opencv-python-headless numpy
```

If you see **"Error when deserializing class 'InputLayer'"** or **"Could not load model"**, switch to **Option A** (Python 3.10 + TensorFlow 2.12).

---

## 3) Add .h5 Model Files to the `models/` Folder

The app expects model files in a **`models`** folder **one level above** the `backend` folder:

```
DermaCure AI - Copy/
  backend/
    app.py
    ...
  models/                    <-- create this folder if it doesn't exist
    vgg16_skin_model.h5
    resnet50_skin_model.h5
    mobilenet_skin_model.h5
    efficientnet_skin_model.h5
```

Required filenames (as used in `app.py`):

| Frontend name | File name                    |
|---------------|------------------------------|
| vgg16         | `vgg16_skin_model.h5`        |
| resnet50      | `resnet50_skin_model.h5`     |
| mobilenet     | `mobilenet_skin_model.h5`    |
| efficient     | `efficientnet_skin_model.h5` |

- **If you have trained models:** copy your `.h5` files into `models/` and name them as in the table (or update `model_mapping` in `backend/app.py` to match your names).
- **If you don’t have models yet:** you need to train or obtain skin-disease classification models (e.g. Keras/TensorFlow) and export them as `.h5`, then place them in `models/` with the names above.

---

## 4) Run the Prediction Backend

From `backend`:

```bash
cd "C:\Users\yashr\Downloads\DermaCure AI - Copy\backend"
python app.py
```

You should see something like:

```
[OK] Loaded model: mobilenet from mobilenet_skin_model.h5
...
[OK] Successfully loaded 4 model(s): ['vgg16', 'resnet50', 'mobilenet', 'efficient']
```

If you see **MOCK MODE ENABLED**, then either:

- Long paths are still not enabled (restart terminal/PC and try again), or  
- The `models/` folder is missing or doesn’t contain the expected `.h5` files, or  
- **TensorFlow failed to load the files** (e.g. *"Error when deserializing class 'InputLayer'"*) → use **Python 3.10 and TensorFlow 2.12** (see step 2, Option A).

---

## If you see "InputLayer" or "Could not load model" errors

Your `.h5` files were saved with an older Keras/TensorFlow. Newer Python (3.11+) and TensorFlow often can’t load them.

**Fix:** Use **Python 3.10** and **TensorFlow 2.12.0** in a dedicated venv:

```powershell
# Install Python 3.10 from python.org, then:
cd "C:\Users\yashr\Downloads\DermaCure AI - Copy\backend"
py -3.10 -m venv venv310
.\venv310\Scripts\Activate.ps1
pip install "tensorflow==2.12.0" flask flask-cors opencv-python-headless numpy
python app.py
```

You should then see `[OK] Loaded model: ...` for each `.h5` file in `models/`.

---

## Quick checklist

- [ ] Run `ENABLE_LONG_PATHS.ps1` as Administrator and restart terminal/PC  
- [ ] Use **Python 3.10 + TensorFlow 2.12** if models fail to load (InputLayer error); else `pip install tensorflow` and other deps  
- [ ] Create `models/` next to `backend/` and add the four `.h5` files with the correct names  
- [ ] Run `python app.py` from `backend` and confirm models load (no mock mode)

After that, the frontend’s **Upload Image** page will use real predictions instead of mock mode.
