import unittest
import requests
import os
#from dotenv import load_dotenv

#load_dotenv()  # Load API keys and secrets from .env

#FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
#FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
#TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL")
#TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD")
#TEST_USER_UID = os.getenv("TEST_USER_UID")  # Firebase UID, NOT email
FIREBASE_API_KEY = "AIzaSyCPffiCDmqS344LZzsLhD0J2fLCMCXSfn0"
FIREBASE_PROJECT_ID = "fyp-2025-3637b"
TEST_USER_EMAIL = "darrengrants@mail.com"
TEST_USER_PASSWORD = "testtest"
TEST_USER_UID = "gjk1MZ8k3JXQD96Dt2If7QFYxXH2"


def get_firebase_token(email, password, api_key):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()["idToken"]


class FirebaseTasksAPITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.id_token = get_firebase_token(TEST_USER_EMAIL, TEST_USER_PASSWORD, FIREBASE_API_KEY)
        cls.headers = {
            "Authorization": f"Bearer {cls.id_token}"
        }
        cls.base_url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents"

    def test_fetch_user_tasks(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn("documents", data)

        for doc in data["documents"]:
            fields = doc["fields"]
            self.assertIn("title", fields)
            self.assertIn("type", fields)
            self.assertIn("completed", fields)

    def test_tasks_count_threshold(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        docs = response.json().get("documents", [])
        self.assertTrue(len(docs) >= 0, "User should have 0 or more tasks")  # Sanity

    def test_create_task(self):
        task_id = "test_task_api"
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks/{task_id}"

        task_data = {
            "fields": {
                "title": {"stringValue": "Test Task from API"},
                "completed": {"booleanValue": False},
                "type": {"stringValue": "basic"},
                "createdAt": {"timestampValue": "2025-01-01T00:00:00Z"}
            }
        }

        response = requests.patch(url, headers=self.headers, json=task_data)
        self.assertIn(response.status_code, [200, 201], "Task creation failed")

        # Confirm task exists afterward
        confirm = requests.get(url, headers=self.headers)
        self.assertEqual(confirm.status_code, 200)
        self.assertEqual(confirm.json()["fields"]["title"]["stringValue"], "Test Task from API")

    def test_mark_task_as_completed(self):
        task_id = "test_task_api"
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks/{task_id}"

        patch = {
            "fields": {
                "completed": {"booleanValue": True}
            }
        }

        response = requests.patch(url, headers=self.headers, json=patch)
        self.assertEqual(response.status_code, 200)

        confirm = requests.get(url, headers=self.headers).json()
        self.assertTrue(confirm["fields"]["completed"]["booleanValue"], "Task not marked complete")

    

    def test_specific_task_exists(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        tasks = response.json().get("documents", [])

        # Filter for docs that contain a title field
        titles = [
            doc["fields"]["title"]["stringValue"]
            for doc in tasks
            if "title" in doc.get("fields", {})
        ]

        self.assertIn("test", titles)

    def test_delete_task(self):
        task_id = "test_task_api"
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks/{task_id}"

        response = requests.delete(url, headers=self.headers)
        self.assertIn(response.status_code, [200, 204])

        check = requests.get(url, headers=self.headers)
        self.assertEqual(check.status_code, 404, "Task still exists after deletion")
    #Call this in tearDown() or setUp() if you want clean test states.
    def _delete_task_if_exists(self, task_id):
        url = f"{self.base_url}/users/{TEST_USER_UID}/tasks/{task_id}"
        _ = requests.delete(url, headers=self.headers)

    def test_user_has_xp(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        fields = response.json()["fields"]
        self.assertIn("xp", fields)
        self.assertIsInstance(int(fields["xp"]["integerValue"]), int)

    def test_user_streak_structure(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        fields = response.json()["fields"]
        self.assertIn("streak", fields)

        streak = fields["streak"]["mapValue"]["fields"]
        self.assertIn("currentStreak", streak)
        self.assertIn("bestStreak", streak)
        self.assertIn("lastLogin", streak)

    def test_completed_tasks_exist(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}/completedTasks"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        # Just check that it returns a list
        self.assertIn("documents", response.json())

    def test_xp_can_be_used_for_leaderboard(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        xp = int(response.json()["fields"]["xp"]["integerValue"])
        level = xp // 100
        progress = xp % 100

        self.assertIsInstance(level, int)
        self.assertIsInstance(progress, int)

    def test_friend_collection_structure(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}/friends"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)
        
        # Presence check
        self.assertIn("documents", response.json())

    def test_achievement_docs_exist(self):
        url = f"{self.base_url}/users/{TEST_USER_UID}/achievements"
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn("documents", data)
        self.assertTrue(len(data["documents"]) > 0, "Expected at least 1 achievement")


    

if __name__ == "__main__":
    unittest.main()
