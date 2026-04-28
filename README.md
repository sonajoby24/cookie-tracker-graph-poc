# cookie-tracker-graph-poc
A proof-of-concept project for tracking, analyzing, and visualizing cookie-related data through a graph-based workflow.

## Project Structure

- `frontend/` - UI and visualization layer
- `backend/` - backend services and API logic
- `crawler/` - data collection and crawling scripts
- `workflow/` - workflow-related files and outputs

## Features

- Cookie data collection
- Graph-based analysis
- Frontend visualization
- Backend processing pipeline

## Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Notes

- `node_modules/`, `.next/`, and `venv/` are excluded using `.gitignore`
- Environment variables should be stored in `.env` files and should not be committed

## Author

Sona Joby