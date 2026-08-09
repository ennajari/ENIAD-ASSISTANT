# 🧠 Custom Fine-Tuned Llama-3 8B Model Deployment (`deploy_code`)

**ENIAD-ASSISTANT** uses a custom fine-tuned **Llama-3 8B Academic Model** (`ahmed-ouka/llama3-8b-eniad-merged-32bit`) developed by **Ahmed OUKACHA**.

The model is deployed on serverless GPU infrastructure using **Modal Platform** and served via **vLLM** with an OpenAI-compatible API interface.

---

## 1. Directory Structure (`deploy_code/`)

```text
deploy_code/
├── app.py                        # Modal Platform Application & Serverless Web Server
├── main.py                       # Model Server Entry Point
├── serve_llama.py                # vLLM Serving Configuration script
└── test_llama3.py                # Health Check & Completion Verification script
```

---

## 2. Model Specifications

| Parameter | Specification |
| :--- | :--- |
| **Base Model** | Meta Llama-3 8B Instruct |
| **Hugging Face Model ID** | [`ahmed-ouka/llama3-8b-eniad-merged-32bit`](https://huggingface.co/ahmed-ouka/llama3-8b-eniad-merged-32bit) |
| **Serving Framework** | vLLM (`vllm==0.7.2`) |
| **Hardware Target** | NVIDIA H100 GPU (1x GPU on Modal) |
| **API Protocol** | OpenAI-compatible `/v1/chat/completions` |

---

## 3. Modal Deployment Workflow (`app.py`)

```python
import modal

vllm_image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("vllm==0.7.2", "huggingface_hub[hf_transfer]==0.26.2")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1", "VLLM_USE_V1": "1"})
)

app = modal.App("llama3-openai-compatible")
MODEL_NAME = "ahmed-ouka/llama3-8b-eniad-merged-32bit"
```

### Deploying to Modal:

```bash
cd deploy_code
modal deploy app.py
```

---

## 4. Frontend Integration (`chatbot-ui`)

The React frontend accesses the deployed model via the `/api/llama` proxy configured in `vite.config.js`:

```javascript
// POST /api/llama/v1/chat/completions
const response = await axios.post('/api/llama/v1/chat/completions', {
  model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit',
  messages: [
    { role: 'system', content: 'You are the official ENIAD AI Academic Assistant.' },
    { role: 'user', content: prompt }
  ]
});
```
