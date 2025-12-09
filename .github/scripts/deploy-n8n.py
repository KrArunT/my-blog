import os
import json
import requests
import sys

# Configuration
N8N_HOST = os.environ.get("N8N_HOST")
N8N_API_KEY = os.environ.get("N8N_API_KEY")
WORKFLOW_FILE = "n8n_workflow.json"

if not N8N_HOST or not N8N_API_KEY:
    print("Error: N8N_HOST and N8N_API_KEY must be set.")
    sys.exit(1)

# Ensure host ends with /api/v1
BASE_URL = f"{N8N_HOST.rstrip('/')}/api/v1"
HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json"
}

def load_workflow():
    with open(WORKFLOW_FILE, "r") as f:
        return json.load(f)

def deploy():
    workflow = load_workflow()
    workflow_name = workflow.get("name")
    
    # Check if workflow exists
    response = requests.get(f"{BASE_URL}/workflows", headers=HEADERS)
    response.raise_for_status()
    workflows = response.json().get("data", [])
    
    existing_id = None
    for w in workflows:
        if w["name"] == workflow_name:
            existing_id = w["id"]
            break
    
    if existing_id:
        print(f"Updating existing workflow: {workflow_name} ({existing_id})")
        # Update
        response = requests.put(f"{BASE_URL}/workflows/{existing_id}", headers=HEADERS, json=workflow)
        response.raise_for_status()
        
        # Activate
        print("Activating workflow...")
        requests.post(f"{BASE_URL}/workflows/{existing_id}/activate", headers=HEADERS)
    else:
        print(f"Creating new workflow: {workflow_name}")
        # Create
        response = requests.post(f"{BASE_URL}/workflows", headers=HEADERS, json=workflow)
        response.raise_for_status()
        new_id = response.json()["data"]["id"]
        
        # Activate
        print("Activating workflow...")
        requests.post(f"{BASE_URL}/workflows/{new_id}/activate", headers=HEADERS)

    print("Deployment successful!")

if __name__ == "__main__":
    try:
        deploy()
    except Exception as e:
        print(f"Deployment failed: {e}")
        sys.exit(1)
