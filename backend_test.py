import requests
import sys
import json
from datetime import datetime, date

class BackendAPITester:
    def __init__(self, base_url="https://db-project-setup.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_status_ids = []
        self.created_patient_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response Data: {json.dumps(response_data, indent=2, default=str)}")
                    return True, response_data
                except:
                    print("Response is not JSON")
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error Response: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error Response Text: {response.text}")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        if success and isinstance(response, dict) and 'DBS' in str(response.get('message', '')):
            print("✅ Root endpoint returned correct DBS message")
            return True
        else:
            print("❌ Root endpoint did not return expected DBS message")
            return False

    def test_get_pacientes_empty(self):
        """Test GET /api/pacientes endpoint"""
        success, response = self.run_test(
            "Get Pacientes (Initial)",
            "GET",
            "api/pacientes",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Pacientes endpoint returned array with {len(response)} items")
            return True
        else:
            print("❌ Pacientes endpoint did not return array")
            return False

    def test_create_paciente(self, patient_data):
        """Test POST /api/pacientes endpoint"""
        success, response = self.run_test(
            f"Create Paciente: {patient_data['nombre']}",
            "POST",
            "api/pacientes",
            200,
            data=patient_data
        )
        if success and isinstance(response, dict):
            if 'id' in response and 'nombre' in response:
                self.created_patient_ids.append(response['id'])
                print(f"✅ Paciente created with ID: {response['id']}")
                return True, response
            else:
                print("❌ Paciente response missing required fields")
                return False, {}
        return False, {}

    def test_get_pacientes_with_data(self):
        """Test GET /api/pacientes endpoint after creating data"""
        success, response = self.run_test(
            "Get Pacientes (After Creation)",
            "GET",
            "api/pacientes",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Pacientes endpoint returned {len(response)} items")
            for item in response:
                if item['id'] in self.created_patient_ids:
                    print(f"✅ Found created paciente: {item['nombre']}")
            return True
        else:
            print("❌ Pacientes endpoint did not return expected data")
            return False

    def test_update_paciente(self, patient_id, updates):
        """Test PUT /api/pacientes/{id} endpoint"""
        success, response = self.run_test(
            f"Update Paciente: {patient_id}",
            "PUT",
            f"api/pacientes/{patient_id}",
            200,
            data=updates
        )
        if success and isinstance(response, dict):
            print(f"✅ Paciente updated successfully")
            return True, response
        else:
            print("❌ Failed to update paciente")
            return False, {}

    def test_delete_paciente(self, patient_id):
        """Test DELETE /api/pacientes/{id} endpoint"""
        success, response = self.run_test(
            f"Delete Paciente: {patient_id}",
            "DELETE",
            f"api/pacientes/{patient_id}",
            200
        )
        if success:
            print(f"✅ Paciente deleted successfully")
            return True
        else:
            print("❌ Failed to delete paciente")
            return False

    def test_get_status_checks_empty(self):
        """Test GET /api/status endpoint (should return empty array initially)"""
        success, response = self.run_test(
            "Get Status Checks (Initial)",
            "GET",
            "api/status",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Status checks endpoint returned array with {len(response)} items")
            return True
        else:
            print("❌ Status checks endpoint did not return array")
            return False

    def test_create_status_check(self, client_name):
        """Test POST /api/status endpoint"""
        test_data = {"client_name": client_name}
        success, response = self.run_test(
            f"Create Status Check for {client_name}",
            "POST",
            "api/status",
            200,
            data=test_data
        )
        if success and isinstance(response, dict):
            if 'id' in response and 'client_name' in response and 'timestamp' in response:
                self.created_status_ids.append(response['id'])
                print(f"✅ Status check created with ID: {response['id']}")
                return True, response
            else:
                print("❌ Status check response missing required fields")
                return False, {}
        return False, {}

    def test_get_status_checks_with_data(self):
        """Test GET /api/status endpoint after creating data"""
        success, response = self.run_test(
            "Get Status Checks (After Creation)",
            "GET",
            "api/status",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"✅ Status checks endpoint returned {len(response)} items")
            for item in response:
                if item['id'] in self.created_status_ids:
                    print(f"✅ Found created status check: {item['client_name']}")
            return True
        else:
            print("❌ Status checks endpoint did not return expected data")
            return False

def main():
    print("🚀 Starting Backend API Testing...")
    print("=" * 50)
    
    # Setup
    tester = BackendAPITester()
    
    # Test 1: Root endpoint
    print("\n📋 TEST 1: Root API Endpoint")
    tester.test_root_endpoint()
    
    # Test 2: Get status checks (empty)
    print("\n📋 TEST 2: Get Status Checks (Initial)")
    tester.test_get_status_checks_empty()
    
    # Test 3: Create status checks
    print("\n📋 TEST 3: Create Status Checks")
    test_clients = [
        f"TestClient_{datetime.now().strftime('%H%M%S')}_1",
        f"TestClient_{datetime.now().strftime('%H%M%S')}_2"
    ]
    
    for client in test_clients:
        success, response = tester.test_create_status_check(client)
        if not success:
            print(f"❌ Failed to create status check for {client}")
    
    # Test 4: Get status checks (with data)
    print("\n📋 TEST 4: Get Status Checks (After Creation)")
    tester.test_get_status_checks_with_data()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS:")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())