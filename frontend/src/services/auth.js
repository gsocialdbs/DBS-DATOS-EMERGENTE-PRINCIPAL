// Servicio de autenticación simple
// En producción, esto debería usar una base de datos real

const VALID_CREDENTIALS = [
  {
    username: 'admin',
    password: 'bienestar2024',
    name: 'Administrador',
    role: 'admin'
  },
  {
    username: 'medico',
    password: 'medico123',
    name: 'Dr. Médico',
    role: 'doctor'
  },
  {
    username: 'enfermera',
    password: 'enfermera123',
    name: 'Enfermera Principal',
    role: 'nurse'
  }
];

export const authService = {
  // Verificar credenciales
  async login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = VALID_CREDENTIALS.find(
          cred => cred.username === credentials.username && cred.password === credentials.password
        );

        if (user) {
          const userSession = {
            id: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString()
          };
          
          // Guardar sesión en localStorage
          localStorage.setItem('userSession', JSON.stringify(userSession));
          
          resolve(userSession);
        } else {
          reject(new Error('Usuario o contraseña incorrectos'));
        }
      }, 1000); // Simular delay de red
    });
  },

  // Obtener sesión actual
  getCurrentUser() {
    try {
      const session = localStorage.getItem('userSession');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return null;
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('userSession');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};