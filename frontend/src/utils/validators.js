export function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  
  export function isValidPassword(password) {
    return password.length >= 8;
  }
  
  export function passwordsMatch(pw1, pw2) {
    return pw1 === pw2;
  }
  