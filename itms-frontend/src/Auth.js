const Auth = {
    isAuthenticated: false,
    authenticate() {
      this.isAuthenticated = true;
    },
    unauthenticate() {
      this.isAuthenticated = false;
    },
    getAuth() {
        return this.isAuthenticated;
    }
};

export default Auth;