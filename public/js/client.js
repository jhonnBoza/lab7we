(function () {
  var TOKEN_KEY = 'jwt_token';

  window.AuthLab = {
    tokenKey: TOKEN_KEY,

    getToken: function () {
      return sessionStorage.getItem(TOKEN_KEY);
    },

    setToken: function (t) {
      sessionStorage.setItem(TOKEN_KEY, t);
    },

    clearSession: function () {
      sessionStorage.removeItem(TOKEN_KEY);
    },

    authHeaders: function () {
      var t = this.getToken();
      var h = { 'Content-Type': 'application/json' };
      if (t) h.Authorization = 'Bearer ' + t;
      return h;
    },

    requireToken: function () {
      if (!this.getToken()) {
        window.location.href = '/signIn';
        return false;
      }
      return true;
    },

    handleAuthResponse: function (res) {
      if (res.status === 401) {
        this.clearSession();
        window.location.href = '/signIn';
        return Promise.reject(new Error('Sesión inválida o caducada'));
      }
      return res;
    },

    formatDateInput: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      var z = function (n) {
        return n < 10 ? '0' + n : '' + n;
      };
      return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
    },

    formatDisplayDate: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      return isNaN(d.getTime()) ? '' : d.toLocaleString('es');
    }
  };
})();
