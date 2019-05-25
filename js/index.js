new Vue({

  el: "#app",

  data: {
    username: '',
    loading: false,
    the_user: '',
    userObject: {},
    not_user: false,
    found: '',
    not_found: '',
    followers: '',
    the_followers: '',
    followersObject: {},
    next_url: '',
    lastItem: false,

  },

  mounted() {
    console.log('Component mounted')
  },

  computed: {
    disabled(){
      return this.loading;
    },
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

                this.getFollowers(this.the_user.followers_url);

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

    getFollowers(url) {

      this.loading = true

      fetch(url)
        .then(res => {
          this.loading = false
          this.followersObject = res;
          return res.json();
        })
        .then(follower_json => {
          const links = this.getLinks(this.followersObject.headers.get('link'));
          const nextUrl = links._next;
            if (this.userObject.status === 200) {
              this.the_followers = follower_json
              this.next_url = nextUrl

              if (this.the_followers.length < 30) {
                this.lastItem = true;
                console.log('the followers are less than  30')
              }
            return;
          }
          this.the_followers = follower_json
        }).catch(err => {
          console.log('these are the errors getting followers: ', err);
        })
    },

    getLinks(theLinks) {
      var links = {};
      if (!theLinks) {
          return links;
      }
      theLinks.split(',').forEach((eachComponent) => {
          let url = eachComponent.substring(eachComponent.indexOf('<') + 1, eachComponent.indexOf('>'));
          let rel = eachComponent.substring(eachComponent.indexOf('rel="') + 5).replace('"', '');
          links['_' + rel] = url;
      });
      return links;
    },


    getMoreFollowers() {

      this.loading = true

      fetch(this.next_url)
        .then(res => {
          this.followersObject = res;
          return res.json();
        })
        .then(follower_json => {
          
          this.loading = false

          const links = this.getLinks(this.followersObject.headers.get('link'));
          const nextUrl = links._next;
          
          if (this.userObject.status === 200) {
            follower_json.forEach(follower => {
              this.the_followers.push(follower);
            })
            if (nextUrl === undefined) {
              this.lastItem = true;
            } else {
              this.next_url = nextUrl
            } 
          return;
        }
        }).catch(err => {
          console.log('these are the errors getting new followers: ', err);
        })
    },
  }
});