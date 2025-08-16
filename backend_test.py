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
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

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

    # ================== FUNCIONARIOS LESIONADOS TESTS ==================
    
    def test_get_funcionarios_lesionados_empty(self):
        """Test GET /api/funcionarios-lesionados endpoint"""
        success, response = self.run_test(
            "Get Funcionarios Lesionados (Initial)",
            "GET",
            "api/funcionarios-lesionados",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Funcionarios Lesionados endpoint returned array with {len(response)} items")
            return True
        else:
            print("❌ Funcionarios Lesionados endpoint did not return array")
            return False

    def test_create_funcionario_lesionado(self, funcionario_data):
        """Test POST /api/funcionarios-lesionados endpoint"""
        success, response = self.run_test(
            f"Create Funcionario Lesionado: {funcionario_data['funcionario_nombre']}",
            "POST",
            "api/funcionarios-lesionados",
            200,
            data=funcionario_data
        )
        if success and isinstance(response, dict):
            if 'id' in response and 'funcionario_nombre' in response:
                print(f"✅ Funcionario Lesionado created with ID: {response['id']}")
                return True, response
            else:
                print("❌ Funcionario Lesionado response missing required fields")
                return False, {}
        return False, {}

    def test_get_funcionarios_lesionados_with_data(self):
        """Test GET /api/funcionarios-lesionados endpoint after creating data"""
        success, response = self.run_test(
            "Get Funcionarios Lesionados (After Creation)",
            "GET",
            "api/funcionarios-lesionados",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Funcionarios Lesionados endpoint returned {len(response)} items")
            return True
        else:
            print("❌ Funcionarios Lesionados endpoint did not return expected data")
            return False

    def test_update_funcionario_lesionado(self, funcionario_id, updates):
        """Test PUT /api/funcionarios-lesionados/{id} endpoint"""
        success, response = self.run_test(
            f"Update Funcionario Lesionado: {funcionario_id}",
            "PUT",
            f"api/funcionarios-lesionados/{funcionario_id}",
            200,
            data=updates
        )
        if success and isinstance(response, dict):
            print(f"✅ Funcionario Lesionado updated successfully")
            return True, response
        else:
            print("❌ Failed to update funcionario lesionado")
            return False, {}

    def test_delete_funcionario_lesionado(self, funcionario_id):
        """Test DELETE /api/funcionarios-lesionados/{id} endpoint"""
        success, response = self.run_test(
            f"Delete Funcionario Lesionado: {funcionario_id}",
            "DELETE",
            f"api/funcionarios-lesionados/{funcionario_id}",
            200
        )
        if success:
            print(f"✅ Funcionario Lesionado deleted successfully")
            return True
        else:
            print("❌ Failed to delete funcionario lesionado")
            return False

    # ================== FALLECIDOS TESTS ==================
    
    def test_get_fallecidos_empty(self):
        """Test GET /api/fallecidos endpoint"""
        success, response = self.run_test(
            "Get Fallecidos (Initial)",
            "GET",
            "api/fallecidos",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Fallecidos endpoint returned array with {len(response)} items")
            return True
        else:
            print("❌ Fallecidos endpoint did not return array")
            return False

    def test_create_fallecido(self, fallecido_data):
        """Test POST /api/fallecidos endpoint"""
        success, response = self.run_test(
            f"Create Fallecido: {fallecido_data['policia_fallecido']}",
            "POST",
            "api/fallecidos",
            200,
            data=fallecido_data
        )
        if success and isinstance(response, dict):
            if 'id' in response and 'policia_fallecido' in response:
                print(f"✅ Fallecido created with ID: {response['id']}")
                return True, response
            else:
                print("❌ Fallecido response missing required fields")
                return False, {}
        return False, {}

    def test_get_fallecidos_with_data(self):
        """Test GET /api/fallecidos endpoint after creating data"""
        success, response = self.run_test(
            "Get Fallecidos (After Creation)",
            "GET",
            "api/fallecidos",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Fallecidos endpoint returned {len(response)} items")
            return True
        else:
            print("❌ Fallecidos endpoint did not return expected data")
            return False

    def test_update_fallecido(self, fallecido_id, updates):
        """Test PUT /api/fallecidos/{id} endpoint"""
        success, response = self.run_test(
            f"Update Fallecido: {fallecido_id}",
            "PUT",
            f"api/fallecidos/{fallecido_id}",
            200,
            data=updates
        )
        if success and isinstance(response, dict):
            print(f"✅ Fallecido updated successfully")
            return True, response
        else:
            print("❌ Failed to update fallecido")
            return False, {}

    def test_delete_fallecido(self, fallecido_id):
        """Test DELETE /api/fallecidos/{id} endpoint"""
        success, response = self.run_test(
            f"Delete Fallecido: {fallecido_id}",
            "DELETE",
            f"api/fallecidos/{fallecido_id}",
            200
        )
        if success:
            print(f"✅ Fallecido deleted successfully")
            return True
        else:
            print("❌ Failed to delete fallecido")
            return False

    # ================== INDEMNIZACIONES TESTS ==================
    
    def test_get_indemnizaciones_empty(self):
        """Test GET /api/indemnizaciones endpoint"""
        success, response = self.run_test(
            "Get Indemnizaciones (Initial)",
            "GET",
            "api/indemnizaciones",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Indemnizaciones endpoint returned array with {len(response)} items")
            return True
        else:
            print("❌ Indemnizaciones endpoint did not return array")
            return False

    def test_create_indemnizacion(self, indemnizacion_data):
        """Test POST /api/indemnizaciones endpoint"""
        success, response = self.run_test(
            f"Create Indemnizacion: {indemnizacion_data['funcionario_policial']}",
            "POST",
            "api/indemnizaciones",
            200,
            data=indemnizacion_data
        )
        if success and isinstance(response, dict):
            if 'id' in response and 'funcionario_policial' in response:
                print(f"✅ Indemnizacion created with ID: {response['id']}")
                return True, response
            else:
                print("❌ Indemnizacion response missing required fields")
                return False, {}
        return False, {}

    def test_get_indemnizaciones_with_data(self):
        """Test GET /api/indemnizaciones endpoint after creating data"""
        success, response = self.run_test(
            "Get Indemnizaciones (After Creation)",
            "GET",
            "api/indemnizaciones",
            200
        )
        if success and isinstance(response, list):
            print(f"✅ Indemnizaciones endpoint returned {len(response)} items")
            return True
        else:
            print("❌ Indemnizaciones endpoint did not return expected data")
            return False

    def test_update_indemnizacion(self, indemnizacion_id, updates):
        """Test PUT /api/indemnizaciones/{id} endpoint"""
        success, response = self.run_test(
            f"Update Indemnizacion: {indemnizacion_id}",
            "PUT",
            f"api/indemnizaciones/{indemnizacion_id}",
            200,
            data=updates
        )
        if success and isinstance(response, dict):
            print(f"✅ Indemnizacion updated successfully")
            return True, response
        else:
            print("❌ Failed to update indemnizacion")
            return False, {}

    def test_delete_indemnizacion(self, indemnizacion_id):
        """Test DELETE /api/indemnizaciones/{id} endpoint"""
        success, response = self.run_test(
            f"Delete Indemnizacion: {indemnizacion_id}",
            "DELETE",
            f"api/indemnizaciones/{indemnizacion_id}",
            200
        )
        if success:
            print(f"✅ Indemnizacion deleted successfully")
            return True
        else:
            print("❌ Failed to delete indemnizacion")
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
    print("🚀 Starting DBS Backend API Testing...")
    print("=" * 50)
    
    # Setup
    tester = BackendAPITester()
    
    # Test 1: Root endpoint
    print("\n📋 TEST 1: Root API Endpoint")
    tester.test_root_endpoint()
    
    # Test 2: Get pacientes (empty)
    print("\n📋 TEST 2: Get Pacientes (Initial)")
    tester.test_get_pacientes_empty()
    
    # Test 3: Create pacientes with visits data
    print("\n📋 TEST 3: Create Pacientes with Visits")
    test_patients = [
        {
            "nombre": f"Juan Pérez Test {datetime.now().strftime('%H%M%S')}",
            "dni": f"12345678{datetime.now().strftime('%S')}",
            "grado": "Sargento",
            "edad": 35,
            "sexo": "masculino",
            "diagnostico": "Fractura de pierna",
            "fecha_ingreso": date.today().isoformat(),
            "status": "interno"
        },
        {
            "nombre": f"María García Test {datetime.now().strftime('%H%M%S')}",
            "dni": f"87654321{datetime.now().strftime('%S')}",
            "grado": "Cabo",
            "edad": 28,
            "sexo": "femenino",
            "diagnostico": "Contusión múltiple",
            "fecha_ingreso": date.today().isoformat(),
            "status": "interno"
        }
    ]
    
    created_patients = []
    for patient in test_patients:
        success, response = tester.test_create_paciente(patient)
        if success:
            created_patients.append(response)
        else:
            print(f"❌ Failed to create patient: {patient['nombre']}")
    
    # Test 4: Get pacientes (with data)
    print("\n📋 TEST 4: Get Pacientes (After Creation)")
    tester.test_get_pacientes_with_data()
    
    # Test 5: Update paciente (simulate adding visits)
    if created_patients:
        print("\n📋 TEST 5: Update Paciente (Add Visits)")
        patient_to_update = created_patients[0]
        updates = {
            "diagnostico": "Fractura de pierna - En recuperación",
            "status": "interno"
        }
        tester.test_update_paciente(patient_to_update['id'], updates)
    
    # Test 6: FUNCIONARIOS LESIONADOS - Main focus of this test
    print("\n📋 TEST 6: FUNCIONARIOS LESIONADOS (MAIN FOCUS)")
    print("=" * 60)
    
    # Test 6.1: Get funcionarios lesionados (empty)
    print("\n📋 TEST 6.1: Get Funcionarios Lesionados (Initial)")
    tester.test_get_funcionarios_lesionados_empty()
    
    # Test 6.2: Create funcionarios lesionados - Testing the exact scenario from the bug report
    print("\n📋 TEST 6.2: Create Funcionarios Lesionados (Bug Fix Test)")
    test_funcionarios = [
        {
            "funcionario_nombre": "Test Funcionario Corregido",
            "funcionario_policial": "Cabo Test Funcionario Corregido",
            "no_expediente": "EXP-001-2024",
            "miembro_amputado": "HERIDO POR ARMA DE FUEGO (C/D)",
            "hospital_traslado": "HOSPITAL MILITAR",
            "gastos": {},
            "total_gastos": 0.0
        },
        {
            "funcionario_nombre": f"Funcionario Test {datetime.now().strftime('%H%M%S')}",
            "funcionario_policial": f"Sargento Funcionario Test {datetime.now().strftime('%H%M%S')}",
            "no_expediente": f"EXP-{datetime.now().strftime('%H%M%S')}-2024",
            "miembro_amputado": "ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHÍCULO (C/D)",
            "hospital_traslado": "HOSPITAL Y CLINICA SAN JORGE",
            "gastos": {"medicamentos": 500.0, "consultas": 300.0},
            "total_gastos": 800.0
        }
    ]
    
    created_funcionarios = []
    for funcionario in test_funcionarios:
        success, response = tester.test_create_funcionario_lesionado(funcionario)
        if success:
            created_funcionarios.append(response)
        else:
            print(f"❌ Failed to create funcionario lesionado: {funcionario['funcionario_nombre']}")
    
    # Test 6.3: Get funcionarios lesionados (with data)
    print("\n📋 TEST 6.3: Get Funcionarios Lesionados (After Creation)")
    tester.test_get_funcionarios_lesionados_with_data()
    
    # Test 6.4: Update funcionario lesionado
    if created_funcionarios:
        print("\n📋 TEST 6.4: Update Funcionario Lesionado")
        funcionario_to_update = created_funcionarios[0]
        updates = {
            "total_gastos": 1500.0,
            "gastos": {"medicamentos": 800.0, "consultas": 400.0, "examenes": 300.0}
        }
        tester.test_update_funcionario_lesionado(funcionario_to_update['id'], updates)
    
    # Test 7: FALLECIDOS - Main focus of this test
    print("\n📋 TEST 7: FALLECIDOS (MAIN FOCUS)")
    print("=" * 60)
    
    # Test 7.1: Get fallecidos (empty)
    print("\n📋 TEST 7.1: Get Fallecidos (Initial)")
    tester.test_get_fallecidos_empty()
    
    # Test 7.2: Create fallecidos - Testing the exact scenario from the request
    print("\n📋 TEST 7.2: Create Fallecidos")
    test_fallecidos = [
        {
            "policia_fallecido": "Test Policía Fallecido",
            "no_expediente": "EXP-FALL-001",
            "causa_muerte": "Accidente en servicio",
            "fecha_muerte": date.today().isoformat(),
            "lugar_muerte": "Hospital Nacional",
            "beneficiarios": "Esposa e hijos",
            "documentos_adjuntos": []
        },
        {
            "policia_fallecido": f"Policía Test {datetime.now().strftime('%H%M%S')}",
            "no_expediente": f"EXP-FALL-{datetime.now().strftime('%H%M%S')}",
            "causa_muerte": "Enfermedad profesional",
            "fecha_muerte": date.today().isoformat(),
            "lugar_muerte": "Hospital Militar",
            "beneficiarios": "Familia directa",
            "documentos_adjuntos": ["acta_defuncion.pdf", "certificado_medico.pdf"]
        }
    ]
    
    created_fallecidos = []
    for fallecido in test_fallecidos:
        success, response = tester.test_create_fallecido(fallecido)
        if success:
            created_fallecidos.append(response)
        else:
            print(f"❌ Failed to create fallecido: {fallecido['policia_fallecido']}")
    
    # Test 7.3: Get fallecidos (with data)
    print("\n📋 TEST 7.3: Get Fallecidos (After Creation)")
    tester.test_get_fallecidos_with_data()
    
    # Test 7.4: Update fallecido
    if created_fallecidos:
        print("\n📋 TEST 7.4: Update Fallecido")
        fallecido_to_update = created_fallecidos[0]
        updates = {
            "beneficiarios": "Esposa, 2 hijos menores y madre",
            "documentos_adjuntos": ["acta_defuncion.pdf", "certificado_medico.pdf", "testamento.pdf"]
        }
        tester.test_update_fallecido(fallecido_to_update['id'], updates)
    
    # Test 8: INDEMNIZACIONES - Main focus of this test
    print("\n📋 TEST 8: INDEMNIZACIONES (MAIN FOCUS)")
    print("=" * 60)
    
    # Test 8.1: Get indemnizaciones (empty)
    print("\n📋 TEST 8.1: Get Indemnizaciones (Initial)")
    tester.test_get_indemnizaciones_empty()
    
    # Test 8.2: Create indemnizaciones - Testing the exact scenario from the request
    print("\n📋 TEST 8.2: Create Indemnizaciones")
    test_indemnizaciones = [
        {
            "funcionario_policial": "Test Funcionario Indemnización",
            "no_expediente": "EXP-IND-001",
            "estado_expediente": "En proceso",
            "suma_pagar": 50000.0,
            "causa_indemnizacion": "Lesión en servicio",
            "fecha_solicitud": date.today().isoformat(),
            "observaciones": "Indemnización por lesión laboral"
        },
        {
            "funcionario_policial": f"Funcionario Indemnización Test {datetime.now().strftime('%H%M%S')}",
            "no_expediente": f"EXP-IND-{datetime.now().strftime('%H%M%S')}",
            "estado_expediente": "Aprobado",
            "suma_pagar": 75000.0,
            "causa_indemnizacion": "Accidente de trabajo",
            "fecha_solicitud": date.today().isoformat(),
            "fecha_pago": date.today().isoformat(),
            "observaciones": "Pago por incapacidad permanente"
        }
    ]
    
    created_indemnizaciones = []
    for indemnizacion in test_indemnizaciones:
        success, response = tester.test_create_indemnizacion(indemnizacion)
        if success:
            created_indemnizaciones.append(response)
        else:
            print(f"❌ Failed to create indemnizacion: {indemnizacion['funcionario_policial']}")
    
    # Test 8.3: Get indemnizaciones (with data)
    print("\n📋 TEST 8.3: Get Indemnizaciones (After Creation)")
    tester.test_get_indemnizaciones_with_data()
    
    # Test 8.4: Update indemnizacion
    if created_indemnizaciones:
        print("\n📋 TEST 8.4: Update Indemnizacion")
        indemnizacion_to_update = created_indemnizaciones[0]
        updates = {
            "estado_expediente": "Pagado",
            "fecha_pago": date.today().isoformat(),
            "observaciones": "Indemnización por lesión laboral - PAGADO"
        }
        tester.test_update_indemnizacion(indemnizacion_to_update['id'], updates)
    
    # Test 9: Status checks (original functionality)
    print("\n📋 TEST 9: Status Checks")
    tester.test_get_status_checks_empty()
    
    test_clients = [
        f"TestClient_{datetime.now().strftime('%H%M%S')}_1",
        f"TestClient_{datetime.now().strftime('%H%M%S')}_2"
    ]
    
    for client in test_clients:
        success, response = tester.test_create_status_check(client)
        if not success:
            print(f"❌ Failed to create status check for {client}")
    
    tester.test_get_status_checks_with_data()
    
    # Test 10: Cleanup - Delete created data
    print("\n📋 TEST 10: Cleanup - Delete Test Data")
    
    # Delete indemnizaciones
    for indemnizacion in created_indemnizaciones:
        tester.test_delete_indemnizacion(indemnizacion['id'])
    
    # Delete fallecidos
    for fallecido in created_fallecidos:
        tester.test_delete_fallecido(fallecido['id'])
    
    # Delete funcionarios lesionados
    for funcionario in created_funcionarios:
        tester.test_delete_funcionario_lesionado(funcionario['id'])
    
    # Delete patients
    for patient in created_patients:
        tester.test_delete_paciente(patient['id'])
    
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