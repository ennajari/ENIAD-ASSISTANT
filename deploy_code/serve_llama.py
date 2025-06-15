import modal

vllm_image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "vllm==0.7.2",
        "huggingface_hub[hf_transfer]==0.26.2",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1", "VLLM_USE_V1": "1"})
)

MODELS_DIR = "/llamas"
MODEL_NAME = "ahmed-ouka/llama3-8b-eniad-merged-32bit"
MODEL_REVISION = "main"
API_KEY = "super-secret-key"  # à personnaliser si nécessaire
VLLM_PORT = 8000
MINUTES = 60

# Volumes Modal créés manuellement
hf_cache_vol = modal.Volume.from_name("huggingface-cache")
vllm_cache_vol = modal.Volume.from_name("vllm-cache")

app = modal.App("llama3-openai-compatible")

@app.function(
    image=vllm_image,
    gpu="A100:1",  # ou H100 si ton compte le permet
    scaledown_window=15 * MINUTES,
    timeout=10 * MINUTES,
    volumes={
        "/root/.cache/huggingface": hf_cache_vol,
        "/root/.cache/vllm": vllm_cache_vol,
    },
)
@modal.web_server(port=VLLM_PORT, startup_timeout=5 * MINUTES)
@modal.concurrent(max_inputs=100)
def serve():
    import subprocess

    cmd = [
        "vllm",
        "serve",
        "--uvicorn-log-level=info",
        MODEL_NAME,
        "--revision",
        MODEL_REVISION,
        "--host",
        "0.0.0.0",
        "--port",
        str(VLLM_PORT),
        "--api-key",
        API_KEY,
    ]

    subprocess.Popen(" ".join(cmd), shell=True)
