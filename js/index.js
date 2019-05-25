new Vue({

  el: "#app",

  data: {
    username: '',
    loading: false,
    the_user: '',
    userObject: {},
    not_user: false,
    found: '',
    not_found: ''
  },

  mounted() {
    console.log('Component mounted')
  },

  methods: {
    search() {
      this.loading = true
      const url = `https://api.github.com/users/${this.username}`;
      fetch(url)
          .then((res) => {
            this.loading = false
            this.userObject = res;
            return res.json()
          })
          .then((user_json) => {
              if (this.userObject.status === 200) {
                this.found = this.userObject.status;
                this.not_user = false
                this.the_user = user_json
                console.log('This is the user: ', this.the_user);

              this.loading = false

              return;

              } else if (this.userObject.status === 404) {
                this.not_found = this.userObject.status;
                this.the_user = null
                this.not_user = true

                this.loading = false

              }
          }).catch((err) => {
          console.log('error getting the user: ', err);
      });
    },
  }
});