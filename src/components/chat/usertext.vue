<template>
  <div id="uesrtext">
    <textarea placeholder="Press Ctrl + Enter to send msg" v-model="content" v-on:keyup="addMessage" v-if="currentSession"></textarea>
    <el-button v-if="currentSession" type="success" size="small" style="margin-left:515px; margin-top:-1px" @click="sendMessage">Send</el-button>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'uesrtext',
  data () {
    return {
      content:''
    }
  },
  computed: mapState(["currentSession"]),
  methods: {
  	addMessage (e) {
  		if (e.ctrlKey && e.keyCode ===13) {
        this.sendMessage();
  		}
  	},
    sendMessage() {
      if (this.content.length) {
        let msgObj = new Object();
        msgObj.to = this.currentSession.username;
        msgObj.content = this.content;
        this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msgObj));
        this.$store.commit('addMessage', msgObj);
        this.content='';
      } else {
        this.$message.error("Message cannot be empty!")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#uesrtext {
	position: absolute;
  bottom: 65px;
  right: 0;
  width: 100%;
  height: 15%;
  border-top: solid 1px #DDD;
  > textarea {
  	padding: 15px;
  	width: 95%;
  	height: 100%;
  	border: none;
  	outline: none;
  }
}
</style>
