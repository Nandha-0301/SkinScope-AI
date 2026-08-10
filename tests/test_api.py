#!/usr/bin/env python
"""Test script to verify the FastAPI /predict endpoint works correctly."""

import asyncio
import json
import os
import sys

from PIL import Image

# Add project root to path for imports
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(project_root))

from backend.config import HUMAN_READABLE_LABELS, NO_SIGNIFICANT_PREDICTION


def allowed_predictions():
    return set(HUMAN_READABLE_LABELS.values()) | {NO_SIGNIFICANT_PREDICTION}


async def test_predict_endpoint():
    """Test the /predict endpoint."""
    print("=" * 60)
    print("TEST: FastAPI /predict Endpoint")
    print("=" * 60)

    try:
        from fastapi.testclient import TestClient
        from backend.app import app

        print("OK FastAPI app loaded")

        client = TestClient(app)
        lesion_path = os.path.join(
            os.path.dirname(project_root),
            "SkinDisease",
            "test",
            "SkinCancer",
            "basal-cell-carcinoma-lesion-54.jpeg",
        )

        with open(lesion_path, "rb") as file_handle:
            response = client.post(
                "/predict",
                files={"file": ("test.jpg", file_handle, "image/jpeg")},
            )

        if response.status_code != 200:
            raise Exception(f"HTTP {response.status_code}: {response.text}")

        result = response.json()

        required_keys = {"prediction", "confidence", "top3"}
        if not required_keys.issubset(result.keys()):
            missing = required_keys - set(result.keys())
            raise ValueError(f"Missing response keys: {missing}")

        if not isinstance(result["top3"], list) or len(result["top3"]) not in {0, 3}:
            raise ValueError(f"top3 should be list of 0 or 3 items, got {len(result['top3'])}")

        for pred in result["top3"]:
            if "label" not in pred or "confidence" not in pred:
                raise ValueError("Each top3 item must have 'label' and 'confidence'")
            if pred["label"] not in HUMAN_READABLE_LABELS.values():
                raise ValueError(f"Unexpected top3 label: {pred['label']}")

        if result["prediction"] not in allowed_predictions():
            raise ValueError(f"Unexpected prediction label: {result['prediction']}")

        print("OK /predict endpoint works correctly")
        print("  - Status: 200 OK")
        print("  - Response format: Valid JSON")
        print(f"  - Top prediction: {result['prediction']}")
        print(f"  - Confidence: {result['confidence']}%")
        print(f"  - Top 3 count: {len(result['top3'])}")
        print("\n  Response:")
        print(f"  {json.dumps(result, indent=2)}")

        return True

    except Exception as exc:
        print(f"FAIL API test failed: {exc}")
        import traceback

        traceback.print_exc()
        return False


def test_startup_event():
    """Test that the startup event executes without error."""
    print("\n" + "=" * 60)
    print("TEST: Startup Event")
    print("=" * 60)

    try:
        from backend.app import startup_event

        asyncio.run(startup_event())

        print("OK Startup event executed successfully")
        print("  - Model preloading works")
        return True

    except Exception as exc:
        print(f"FAIL Startup test failed: {exc}")
        import traceback

        traceback.print_exc()
        return False


def test_response_format_compatibility():
    """Test that response format matches frontend expectations."""
    print("\n" + "=" * 60)
    print("TEST: Frontend Response Format Compatibility")
    print("=" * 60)

    try:
        from backend.predict import predict_image

        lesion_path = os.path.join(
            os.path.dirname(project_root),
            "SkinDisease",
            "test",
            "SkinCancer",
            "basal-cell-carcinoma-lesion-54.jpeg",
        )
        result = predict_image(lesion_path)

        checks = []

        if isinstance(result.get("prediction"), str):
            checks.append(("OK", "prediction is string"))
        else:
            checks.append(("FAIL", f"prediction should be string, got {type(result.get('prediction')).__name__}"))

        if isinstance(result.get("confidence"), (int, float)):
            checks.append(("OK", f"confidence is numeric ({result['confidence']}%)"))
        else:
            checks.append(("FAIL", f"confidence should be numeric, got {type(result.get('confidence')).__name__}"))

        if isinstance(result.get("top3"), list):
            checks.append(("OK", f"top3 is list with {len(result['top3'])} items"))
        else:
            checks.append(("FAIL", f"top3 should be list, got {type(result.get('top3')).__name__}"))

        top3_valid = len(result.get("top3", [])) in {0, 3}
        for item in result.get("top3", []):
            if not isinstance(item, dict) or "label" not in item or "confidence" not in item:
                top3_valid = False
                break
            if item["label"] not in HUMAN_READABLE_LABELS.values():
                top3_valid = False
                break

        if top3_valid:
            checks.append(("OK", "top3 items use the expected structure and safe label set"))
        else:
            checks.append(("FAIL", "top3 items are missing fields or use invalid labels"))

        if result.get("prediction") in allowed_predictions():
            checks.append(("OK", "prediction uses HAM10000-safe label set"))
        else:
            checks.append(("FAIL", f"unexpected prediction label: {result.get('prediction')}"))

        all_ok = True
        for status, message in checks:
            print(f"  {status} {message}")
            if status == "FAIL":
                all_ok = False

        if all_ok:
            print("\nOK Response format fully compatible with frontend")
        else:
            print("\nFAIL Response format has compatibility issues")

        return all_ok

    except Exception as exc:
        print(f"FAIL Format compatibility test failed: {exc}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    os.chdir(project_root)

    results = []
    results.append(("Startup Event", test_startup_event()))
    results.append(("Response Format", test_response_format_compatibility()))
    results.append(("API Endpoint", asyncio.run(test_predict_endpoint())))

    print("\n" + "=" * 60)
    print("API TEST SUMMARY")
    print("=" * 60)

    for test_name, passed in results:
        status = "PASS" if passed else "FAIL"
        print(f"{status}: {test_name}")

    if all(result[1] for result in results):
        print("\nAll API tests passed. Frontend compatible.")
        sys.exit(0)

    print("\nSome API tests failed")
    sys.exit(1)
