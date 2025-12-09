import os
from huggingface_hub import upload_folder

token = os.environ["HF_TOKEN"]

upload_folder(
    repo_id="KrArunT/my-blog",
    folder_path=".",
    repo_type="space",
    token=token,
    create_repo=True
)
